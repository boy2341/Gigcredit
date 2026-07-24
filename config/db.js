const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigcredit';
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`[DB] Connection error: ${err.message}`);
    // In a hackathon/demo setting we don't want the whole process to silently
    // hang if Mongo isn't reachable yet - fail loud but let nodemon retry on restart.
    process.exit(1);
  }
};

module.exports = connectDB;
