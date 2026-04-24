const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Wedding = require('./models/Wedding');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing
    await User.deleteMany();
    await Wedding.deleteMany();

    // Create Host
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const host = await User.create({
      name: 'Rajesh Sharma',
      email: 'host@example.com',
      password: hashedPassword,
      role: 'host',
      verified: true
    });

    // Create Wedding
    await Wedding.create({
      title: 'Royal Rajasthani Wedding in Jaipur',
      description: 'Experience the grandeur of a true Rajasthani royal wedding. Join our family for 3 days of celebration, rich food, and cultural immersion.',
      location: { address: 'Rambagh Palace, Jaipur, Rajasthan' },
      date: new Date('2026-11-15'),
      price: 1500,
      hostId: host._id,
      images: ['https://images.unsplash.com/photo-1583939000240-690a1e05d0bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'],
      maxGuests: 5,
      rituals: [
        { name: 'Haldi', time: 'Day 1 - 10:00 AM', description: 'Turmeric ceremony for glowing skin.' },
        { name: 'Sangeet', time: 'Day 1 - 7:00 PM', description: 'Musical night with dance performances.' },
        { name: 'Wedding Ceremony', time: 'Day 2 - 8:00 PM', description: 'Main ritual around the holy fire.' }
      ]
    });

    console.log('Sample Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
