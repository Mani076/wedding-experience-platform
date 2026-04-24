const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rituals: [
    {
      name: String,
      description: String,
      time: String,
    }
  ],
  location: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [
    { type: String }
  ],
  maxGuests: {
    type: Number,
    required: true,
  },
  bookedGuests: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Wedding = mongoose.model('Wedding', weddingSchema);
module.exports = Wedding;
