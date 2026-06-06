// server.js
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // options can be added if needed
    });
    console.log('✅ MongoDB connected');

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`✅ PrepDaily backend running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('\n🛑 Shutting down server...');
      server.close(() => {
        console.log('🛑 HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('🛑 MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();