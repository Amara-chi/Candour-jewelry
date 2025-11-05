import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Route files
import auth from './routes/auth.js';
import users from './routes/users.js'; 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Candour Jewelry API is running!',
    timestamp: new Date().toISOString()
  });
});

// Connect to database and start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();