const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, payForBooking, getHostBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking);

router.route('/mybookings')
  .get(protect, getMyBookings);

router.route('/hostbookings')
  .get(protect, authorize('host'), getHostBookings);

router.route('/:id/pay')
  .put(protect, payForBooking);

module.exports = router;
