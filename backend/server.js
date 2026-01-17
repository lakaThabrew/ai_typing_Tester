import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Typing Tester API Running' });
  console.log('🏃‍♂️ Health check endpoint hit');
});

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📍 Database:', mongoose.connection.name);

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    console.error('💡 Check your connection string and network access settings');
  });

// Handle connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB Atlas error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Atlas disconnected');
});