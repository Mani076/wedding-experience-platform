const express = require('express');
const router = express.Router();
const { createReview, getWeddingReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/wedding/:id')
  .get(getWeddingReviews);

module.exports = router;
