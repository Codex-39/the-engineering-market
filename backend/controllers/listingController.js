import Listing from '../models/Listing.js';

// @desc    Create a new item listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req, res) => {
  const { title, description, price, category, condition, images, state, city, college } = req.body;

  try {
    const listing = await Listing.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      images,
      state,
      city,
      college,
      seller: req.user._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all active listings with optional query search/category
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res) => {
  const { search, category, seller, status, state, city, college } = req.query;

  let query = {};

  // Default to active listings unless a specific status is requested
  if (status) {
    query.status = status;
  } else if (!seller) {
    query.status = 'active';
  }

  if (seller) {
    query.seller = seller;
  }

  // Location and category filters (ignore placeholder values like 'All' or 'All India')
  if (state && state !== 'All' && state !== 'All India') {
    query.state = state;
  }
  if (city && city !== 'All') {
    query.city = city;
  }
  if (college && college !== 'All') {
    query.college = college;
  }
  if (category && category !== 'All') {
    query.category = category;
  }

  // Search across text fields including location fields
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { college: { $regex: search, $options: 'i' } },
    ];
  }
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  try {
    const listings = await Listing.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res) => {
  const { title, description, price, category, condition, image } = req.body;

  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this listing' });
    }

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price !== undefined ? Number(price) : listing.price;
    listing.category = category || listing.category;
    listing.condition = condition || listing.condition;
    listing.image = image || listing.image;

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark listing as sold / toggle status
// @route   PATCH /api/listings/:id/sold
// @access  Private
export const markListingSold = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Toggle status
    listing.status = listing.status === 'active' ? 'sold' : 'active';
    const updatedListing = await listing.save();

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
