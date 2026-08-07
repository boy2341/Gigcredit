const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI && process.env.VERCEL) {
    console.log('[DB] Running in In-Memory / Mock Data Mode on Vercel');
    return;
  }

  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigcredit';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to MongoDB: ${err.message}. Falling back to In-Memory Mock Data.`);
    // Do NOT execute process.exit(1) on Vercel or production serverless environments!
  }
};

module.exports = connectDB;
