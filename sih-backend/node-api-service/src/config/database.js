const connectDB = async () => {
  try {
    const mongoose = require('mongoose');
    const conn = await mongoose.connect(process.env.MONGODB_URI );
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] MongoDB Note: ${error.message}. Running in API Gateway mode.`);
  }
};

module.exports = connectDB;