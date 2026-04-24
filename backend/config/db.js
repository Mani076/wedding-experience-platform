const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      console.error('❌ Error: MONGO_URI is missing in the .env file.');
      console.error('👉 Please make sure MONGO_URI=your_connection_string is set.');
      process.exit(1);
    }

    // If using localhost, spin up an in-memory MongoDB automatically for zero-friction setup!
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.log('🔄 Localhost detected. Starting in-memory MongoDB for easy testing...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Automatically seed data if we just started an empty in-memory DB
    if (uri.includes('mongodb-memory-server') || uri.includes('127.0.0.1')) {
      const Wedding = require('../models/Wedding');
      const User = require('../models/User');
      const Booking = require('../models/Booking');
      const count = await Wedding.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding dummy data...');
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const host = await User.create({
          name: 'Rajesh Sharma',
          email: 'host@example.com',
          password: hashedPassword,
          role: 'host',
          verified: true
        });

        const tourist = await User.create({
          name: 'John Doe',
          email: 'tourist@example.com',
          password: hashedPassword,
          role: 'tourist',
          verified: true
        });

        const weddings = await Wedding.create([
          {
            title: 'Royal Rajasthani Wedding in Jaipur',
            description: 'Experience the grandeur of a true Rajasthani royal wedding. Join our family for 3 days of celebration, rich food, and cultural immersion.',
            location: { address: 'Rambagh Palace, Jaipur, Rajasthan' },
            date: new Date('2026-11-15'),
            price: 1500,
            hostId: host._id,
            images: ['https://images.unsplash.com/photo-1583939000240-690a1e05d0bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'],
            maxGuests: 5,
            bookedGuests: 2,
            rituals: [
              { name: 'Haldi', time: 'Day 1 - 10:00 AM', description: 'Turmeric ceremony for glowing skin.' },
              { name: 'Wedding Ceremony', time: 'Day 2 - 8:00 PM', description: 'Main ritual around the holy fire.' }
            ]
          },
          {
            title: 'Traditional Goan Beach Wedding',
            description: 'A beautiful blend of Indian and Portuguese culture by the sea. Expect incredible seafood, music, and a vibrant sunset ceremony.',
            location: { address: 'Taj Exotica Resort & Spa, Goa' },
            date: new Date('2026-12-05'),
            price: 1200,
            hostId: host._id,
            images: ['https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'],
            maxGuests: 10,
            bookedGuests: 0,
            rituals: [
              { name: 'Mehendi', time: 'Day 1 - 4:00 PM', description: 'Henna application ceremony by the beach.' },
              { name: 'Church Blessing & Reception', time: 'Day 2 - 5:00 PM', description: 'Catholic blessing followed by a lively Indian reception.' }
            ]
          }
        ]);

        await Booking.create({
          userId: tourist._id,
          weddingId: weddings[0]._id,
          guests: 2,
          totalAmount: 3000,
          paymentStatus: 'pending',
          status: 'pending'
        });

        console.log('✅ Dummy data added successfully! (Tourist, Host, Wedding, Booking)');
      }
    }
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
