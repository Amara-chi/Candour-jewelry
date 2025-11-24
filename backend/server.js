import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import users from './routes/users.js';
import products from './routes/products.js';
import { v2 as cloudinary } from 'cloudinary';
import categories from './routes/category.js';

// Load env vars
dotenv.config();

const app = express();

// Enhanced CORS for Replit and Vercel
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://candour-jewelry.vercel.app',
    /\.vercel\.app$/,
    /\.replit\.dev$/,
    /\.repl\.co$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const connectDB = async (retries = 5, delay = 2000) => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGODB_URI;
    console.log('📝 MongoDB URI:', mongoUri ? ' set ' : 'NOT SET');
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ MongoDB Connected Successfully to:', conn.connection.host);
    console.log('📊 Database:', conn.connection.db.databaseName);
    return true;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed (${retries} retries left):`);
    console.error('📛 Error Name:', error.name);
    console.error('💬 Error Message:', error.message);
    
    if (retries > 0) {
      console.log(`🔄 Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1, delay * 1.5); 
    }
    
    return false;
  }
};

mongoose.connection.on('connected', () => {
  console.log('🏠 Host:', mongoose.connection.host);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 Mongoose connecting to MongoDB...');
});

mongoose.connection.on('disconnecting', () => {
  console.log('🔌 Mongoose disconnecting from MongoDB...');
});

connectDB();

// Use routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/categories', categories);

// Vercel-specific debug endpoint
app.get('/api/debug/vercel-env', (req, res) => {
  const mongoUri = process.env.MONGODB_URI;
  
  res.json({
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    mongoUriExists: !!mongoUri,
    mongoUriLength: mongoUri ? mongoUri.length : 0,
    mongoUriStartsWith: mongoUri ? mongoUri.substring(0, 50) + '...' : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes('MONGO') || key.includes('VERCEL') || key.includes('NODE')
    )
  });
});

// Database debug endpoint
app.get('/api/debug/db', (req, res) => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  const debugInfo = {
    environment: process.env.NODE_ENV,
    mongoUriExists: !!mongoUri,
    mongoUriStartsWith: mongoUri ? mongoUri.substring(0, 30) + '...' : 'NOT SET',
    mongooseState: mongoose.connection.readyState,
    mongooseStateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    nodeVersion: process.version
  };

  console.log('🔍 Database Debug Info:', debugInfo);
  res.json(debugInfo);
});

// Test database query endpoint
app.get('/api/debug/test-query', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json({
      success: true,
      message: 'Database query successful',
      collections: collections.map(c => c.name),
      readyState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error.message,
      readyState: mongoose.connection.readyState
    });
  }
});

// Test database ping endpoint
app.get('/api/debug/test-ping', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    const result = await mongoose.connection.db.admin().ping();
    
    res.json({
      success: true,
      message: 'Database ping successful',
      ping: result,
      readyState: mongoose.connection.readyState,
      database: mongoose.connection.db.databaseName
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database ping failed',
      error: error.message,
      readyState: mongoose.connection.readyState
    });
  }
});

// Connection test endpoint
app.get('/api/debug/connection-test', async (req, res) => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Create a new connection to get detailed error
    const mongooseTest = await import('mongoose');
    const testConn = await mongooseTest.default.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    
    await testConn.asPromise();
    
    res.json({
      success: true,
      message: 'Connection test passed',
      host: testConn.host,
      database: testConn.db.databaseName
    });
    
    await testConn.close();
    
  } catch (error) {
    res.json({
      success: false,
      message: 'Connection test failed',
      error: error.message,
      errorName: error.name,
      errorCode: error.code
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    message: 'Candour Jewelry API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    version: '1.0.0'
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Candour Jewelry API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health',
      debug: '/api/debug'
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

// Export the app directly for Vercel
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, 'localhost', () => {
    console.log(`Server running in development mode on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}