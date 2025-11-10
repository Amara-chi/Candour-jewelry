import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();

// CORS
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

// MongoDB connection with direct driver
let client = null;
let db = null;

const connectDB = async () => {
  if (db) {
    return db;
  }

  try {
    console.log('🔗 Connecting to MongoDB with direct driver...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set');
    }

    client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    });

    await client.connect();
    db = client.db();
    
    console.log('✅ MongoDB Connected Successfully with direct driver');
    console.log('📊 Database:', db.databaseName);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    client = null;
    db = null;
    throw error;
  }
};

// Connection middleware
app.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (error) {
    console.error('Connection middleware error:', error.message);
    req.db = null;
    next();
  }
});

// Import and use routes
import auth from './routes/auth.js';
import users from './routes/users.js';

// Update your auth routes to use direct MongoDB
app.use('/api/auth', auth);
app.use('/api/users', users);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = db !== null;
    
    if (isConnected) {
      // Test the connection
      await db.admin().ping();
    }
    
    res.json({ 
      message: 'Candour Jewelry API is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      database: isConnected ? 'connected' : 'disconnected',
      version: '1.0.0'
    });
  } catch (error) {
    res.json({ 
      message: 'Candour Jewelry API is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      database: 'disconnected',
      error: error.message,
      version: '1.0.0'
    });
  }
});

// Debug endpoints
app.get('/api/debug/db', async (req, res) => {
  const mongoUri = process.env.MONGODB_URI;
  const isConnected = db !== null;
  
  res.json({
    environment: process.env.NODE_ENV,
    mongoUriExists: !!mongoUri,
    mongoUriStartsWith: mongoUri ? mongoUri.substring(0, 30) + '...' : 'NOT SET',
    isConnected: isConnected,
    databaseName: db ? db.databaseName : 'unknown'
  });
});

app.get('/api/debug/test-ping', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.admin().ping();
    
    res.json({
      success: true,
      message: 'Database ping successful',
      ping: result,
      database: database.databaseName
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database ping failed',
      error: error.message
    });
  }
});

// Root endpoint
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

// Handle 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Cleanup on exit
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});

export default app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}