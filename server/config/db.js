const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb+srv://db_user:tharaka123@cluster0.xhawcbe.mongodb.net/unihelp?retryWrites=true&w=majority'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;



//mongodb+srv://db_user:tharaka123@cluster0.xhawcbe.mongodb.net/?appName=Cluster0
//mongodb://localhost:27017/unihelp
