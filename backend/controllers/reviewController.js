const Review = require('../models/Review');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Tourist)
const createReview = async (req, res) => {
  try {
    const { weddingId, rating, comment } = req.body;

    const review = new Review({
      userId: req.user._id,
      weddingId,
      rating,
      comment,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a wedding
// @route   GET /api/reviews/wedding/:id
// @access  Public
const getWeddingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ weddingId: req.params.id }).populate('userId', 'name profileImage');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getWeddingReviews,
};
