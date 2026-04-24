const Booking = require('../models/Booking');
const Wedding = require('../models/Wedding');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Tourist)
const createBooking = async (req, res) => {
  try {
    const { weddingId, guests } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    if (wedding.bookedGuests + guests > wedding.maxGuests) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const totalAmount = wedding.price * guests;

    const booking = new Booking({
      userId: req.user._id,
      weddingId,
      guests,
      totalAmount,
    });

    const createdBooking = await booking.save();

    // Update booked guests in wedding
    wedding.bookedGuests += guests;
    await wedding.save();

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('weddingId', 'title location date price images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock payment for booking
// @route   PUT /api/bookings/:id/pay
// @access  Private
const payForBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Mock payment success
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for host's weddings
// @route   GET /api/bookings/hostbookings
// @access  Private (Host)
const getHostBookings = async (req, res) => {
  try {
    // Find all weddings owned by this host
    const weddings = await Wedding.find({ hostId: req.user._id });
    const weddingIds = weddings.map(w => w._id);

    // Find all bookings for these weddings
    const bookings = await Booking.find({ weddingId: { $in: weddingIds } })
      .populate('weddingId', 'title date')
      .populate('userId', 'name email');
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  payForBooking,
  getHostBookings,
};
