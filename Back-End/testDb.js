const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://user1234:1234@client-management-syste.uxfvf.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

connectDB();
