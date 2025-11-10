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
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ MongoDB Connected Successfully to:', conn.connection.host);
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Connection string used:', process.env.MONGODB_URI || process.env.MONGO_URI ? '***' : 'NOT SET');
    return false;
  }
};

// Enhanced connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Connect to DB immediately
connectDB();

// Import routes
import auth from './routes/auth.js';
import users from './routes/users.js';

// Use routes
app.use('/api/auth', auth);
app.use('/api/users', users);


app.get('/api/debug/db', (req, res) => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  const debugInfo = {
    environment: process.env.NODE_ENV,
    mongoUriExists: !!mongoUri,
    mongoUriStartsWith: mongoUri ? mongoUri.substring(0, 30) + '...' : 'NOT SET',
    mongooseState: mongoose.connection.readyState,
    mongooseStateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    nodeVersion: process.version,
    bufferCommands: false,
    bufferMaxEntries: 0,
    family: 4
  };

  console.log('🔍 Database Debug Info:', debugInfo);
  res.json(debugInfo);
});

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
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}