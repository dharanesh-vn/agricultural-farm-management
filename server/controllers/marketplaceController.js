const Listing = require('../models/Listing');

/**
 * @desc    Create a new marketplace listing
 * @route   POST /api/marketplace
 * @access  Private
 */
const createListing = async (req, res, next) => {
  const { title, description, price, category, media } = req.body;

  try {
    const listing = new Listing({
      seller: req.user._id,
      title,
      description,
      price,
      category,
      media,
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all marketplace listings
 * @route   GET /api/marketplace
 * @access  Public
 */
const getListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ isSold: false })
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single listing by ID
 * @route   GET /api/marketplace/:id
 * @access  Public
 */
const getListingById = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('seller', 'name email');
        if (listing) {
            res.json(listing);
        } else {
            res.status(404);
            throw new Error('Listing not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a listing
 * @route   DELETE /api/marketplace/:id
 * @access  Private
 */
const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            res.status(404);
            throw new Error('Listing not found');
        }

        if (listing.seller.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this listing');
        }

        await listing.remove();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        next(error);
    }
};


module.exports = {
  createListing,
  getListings,
  getListingById,
  deleteListing,
};