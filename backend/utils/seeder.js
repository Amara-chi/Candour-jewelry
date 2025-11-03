import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@candourjewelry.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@candourjewelry.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully!');
      console.log('Email: admin@candourjewelry.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit();
  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

createAdminUser();