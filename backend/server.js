import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app = express();

// Enhanced CORS for Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://candour-jewelry.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
let isDbConnected = false;

const connectDB = async () => {
  if (isDbConnected) return;
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    isDbConnected = true;
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Don't throw error in production - let it retry
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
};

// Import routes
import auth from './routes/auth.js';
import users from './routes/users.js';

// Use routes
app.use('/api/auth', auth);
app.use('/api/users', users);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB(); // Ensure DB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({ 
      message: 'Candour Jewelry API is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      message: 'API is running but database connection failed',
      error: error.message
    });
  }
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Candour Jewelry API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Vercel serverless function handler
const handler = async (req, res) => {
  // Ensure DB connection on cold start
  if (!isDbConnected) {
    await connectDB();
  }
  
  return app(req, res);
};

// Export for Vercel serverless
export default handler;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}