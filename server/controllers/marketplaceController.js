const Auction = require('../models/Auction');

const getListings = async (req, res, next) => {
  try {
    // This correctly fetches all auctions that are currently active
    const auctions = await Auction.find({ status: 'active' })
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
};