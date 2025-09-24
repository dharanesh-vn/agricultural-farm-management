const Auction = require('../models/Auction');
const Contract = require('../models/Contract');
const mongoose = require('mongoose');

const auctionTimers = {};

const endAuction = async (io, auctionId) => {
    if (auctionTimers[auctionId]) {
        clearTimeout(auctionTimers[auctionId]);
        delete auctionTimers[auctionId];
    }
    try {
        const auction = await Auction.findById(auctionId);
        if (!auction || auction.status !== 'active') return;

        auction.status = 'ended';
        if (auction.highestBidder) {
            auction.winner = auction.highestBidder;
            await Contract.create({
                farmer: auction.seller,
                buyer: auction.winner,
                produce: auction.itemName,
                quantity: parseFloat(auction.quantity.split(' ')[0]) || 1,
                price: auction.currentBid,
            });
        }
        
        const endedAuction = await auction.save();
        const populatedAuction = await Auction.findById(endedAuction._id).populate('seller buyer winner', 'name');
        
        io.to(auctionId.toString()).emit('auctionEnded', populatedAuction);

        if (populatedAuction.winner) {
            const contract = await Contract.findOne({ farmer: populatedAuction.seller._id, buyer: populatedAuction.winner._id, produce: populatedAuction.itemName }).populate('farmer buyer', 'name');
            const farmerSocket = findSocketByUserId(io, populatedAuction.seller._id);
            const buyerSocket = findSocketByUserId(io, populatedAuction.winner._id);
            if (farmerSocket) farmerSocket.emit('newContract', contract);
            if (buyerSocket) buyerSocket.emit('newContract', contract);
        }
        console.log(`🏁 Auction ${auctionId} has ended.`);
    } catch (error) {
        console.error(`❌ Error ending auction ${auctionId}:`, error);
    }
};

const findSocketByUserId = (io, userId) => {
    for (const [id, socket] of io.of("/").sockets) {
        if (socket.userId === userId.toString()) return socket;
    }
    return null;
};

const socketLogic = (io) => {
    io.on('connection', (socket) => {
        socket.on('identify', (userId) => {
            socket.userId = userId;
            console.log(`Socket ${socket.id} identified as User ${userId}`);
        });

        socket.on('startAuction', async (data) => {
            try {
                const newAuction = new Auction({
                    seller: data.sellerId,
                    sellerName: data.sellerName,
                    itemName: data.itemName,
                    quantity: data.quantity,
                    startingBid: data.startingBid,
                    currentBid: data.startingBid,
                    minIncrement: data.minIncrement,
                    startTime: new Date(),
                    endTime: new Date(new Date().getTime() + data.duration * 60000),
                });
                const savedAuction = await newAuction.save();
                io.emit('auctionStarted', savedAuction);
                console.log(`📢 Auction started: ${savedAuction._id}`);
                auctionTimers[savedAuction._id] = setTimeout(() => endAuction(io, savedAuction._id), data.duration * 60000);
            } catch (error) {
                console.error('Error starting auction:', error);
                socket.emit('auctionError', { message: 'Failed to start auction.' });
            }
        });

        socket.on('placeBid', async ({ auctionId, bidAmount, bidderId, bidderName }) => {
            try {
                const auction = await Auction.findById(auctionId);
                if (!auction || auction.status !== 'active') {
                    return socket.emit('auctionError', { message: "Auction is not active." });
                }
                const minNextBid = auction.currentBid + auction.minIncrement;
                if (bidAmount < minNextBid) {
                    return socket.emit('auctionError', { message: `Bid too low. Minimum is ₹${minNextBid}.` });
                }
                if (auction.seller.toString() === bidderId) {
                    return socket.emit('auctionError', { message: "You cannot bid on your own auction." });
                }

                auction.currentBid = bidAmount;
                auction.highestBidder = bidderId;
                auction.highestBidderName = bidderName;
                const updatedAuction = await auction.save();
                
                io.to(auctionId).emit('newBidUpdate', updatedAuction);
                console.log(`💰 New bid of ₹${bidAmount} for auction ${auctionId}.`);
            } catch (error) { 
                console.error(`❌ Error placing bid for auction ${auctionId}:`, error);
                socket.emit('auctionError', { message: "Server error while placing bid." });
            }
        });

        socket.on('joinAuction', (auctionId) => socket.join(auctionId));
        socket.on('disconnect', () => console.log('❌ User disconnected:', socket.id));
    });
};

module.exports = { socketLogic };