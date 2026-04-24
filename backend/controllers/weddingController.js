const Wedding = require('../models/Wedding');

// @desc    Get all weddings (with search & filter)
// @route   GET /api/weddings
// @access  Public
const getWeddings = async (req, res) => {
  try {
    const { location, maxPrice } = req.query;
    let query = {};

    if (location) {
      query['location.address'] = { $regex: location, $options: 'i' };
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    const weddings = await Wedding.find(query).populate('hostId', 'name profileImage');
    res.json(weddings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single wedding by ID
// @route   GET /api/weddings/:id
// @access  Public
const getWeddingById = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id).populate('hostId', 'name profileImage');
    if (wedding) {
      res.json(wedding);
    } else {
      res.status(404).json({ message: 'Wedding not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a wedding
// @route   POST /api/weddings
// @access  Private (Host only)
const createWedding = async (req, res) => {
  try {
    const { title, description, rituals, location, date, price, images, maxGuests } = req.body;

    const wedding = new Wedding({
      title,
      description,
      rituals,
      location,
      date,
      price,
      images,
      maxGuests,
      hostId: req.user._id,
    });

    const createdWedding = await wedding.save();
    res.status(201).json(createdWedding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get host's weddings
// @route   GET /api/weddings/myweddings
// @access  Private (Host only)
const getMyWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find({ hostId: req.user._id });
    res.json(weddings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWeddings,
  getWeddingById,
  createWedding,
  getMyWeddings,
};
