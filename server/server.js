const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const Auction = require('./models/Auction');
const Contract = require('./models/Contract');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" },
});

const auctionTimers = {};

io.on('connection', (socket) => {
    console.log('✅ User connected via Socket.io:', socket.id);

    socket.on('joinAuction', (auctionId) => socket.join(auctionId));
    socket.on('leaveAuction', (auctionId) => socket.leave(auctionId));

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

            auctionTimers[savedAuction._id] = setTimeout(async () => {
                const endedAuction = await Auction.findById(savedAuction._id);
                if (endedAuction && endedAuction.status === 'active') {
                    endedAuction.status = 'ended';
                    if (endedAuction.highestBidder) {
                        endedAuction.winner = endedAuction.highestBidder;
                        await Contract.create({
                            farmer: endedAuction.seller,
                            buyer: endedAuction.winner,
                            produce: endedAuction.itemName,
                            quantity: parseFloat(endedAuction.quantity.split(' ')[0]) || 1,
                            price: endedAuction.currentBid,
                        });
                    }
                    await endedAuction.save();
                    io.to(endedAuction._id.toString()).emit('auctionEnded', endedAuction);
                    console.log(`Auction ${endedAuction._id} has ended.`);
                }
            }, data.duration * 60000);
        } catch (error) { console.error('Error starting auction:', error); }
    });

    socket.on('placeBid', async ({ auctionId, bidAmount, bidderId, bidderName }) => {
        try {
            const auction = await Auction.findById(auctionId);
            const minNextBid = auction.currentBid + auction.minIncrement;

            if (auction.status !== 'active') {
                return socket.emit('auctionError', { message: "This auction has already ended." });
            }
            if (bidAmount < minNextBid) {
                return socket.emit('auctionError', { message: `Your bid is too low. Minimum next bid is ₹${minNextBid}.` });
            }
            
            const updatedAuction = await Auction.findByIdAndUpdate(
                auctionId,
                { currentBid: bidAmount, highestBidder: bidderId, highestBidderName: bidderName },
                { new: true }
            );
            io.to(auctionId).emit('newBidUpdate', updatedAuction);
        } catch (error) { 
            console.error('Error placing bid:', error);
            socket.emit('auctionError', { message: "A server error occurred." });
        }
    });

    socket.on('disconnect', () => { console.log('❌ User disconnected:', socket.id); });
});

app.set('socketio', io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));