const express = require('express');
const router = express.Router();
const { getWeddings, getWeddingById, createWedding, getMyWeddings } = require('../controllers/weddingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getWeddings)
  .post(protect, authorize('host', 'admin'), createWedding);

router.route('/myweddings')
  .get(protect, authorize('host'), getMyWeddings);

router.route('/:id')
  .get(getWeddingById);

module.exports = router;
