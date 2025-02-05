const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const connectDB = require('./config/db'); // Database connection
const User = require('./Models/UserModel'); // User model

// Load environment variables from .env file
dotenv.config();
console.log('Environment Variables Loaded');

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in the .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in the .env file');
  process.exit(1);
}

// Connect to the database
connectDB().then(() => {
  console.log('✅ MongoDB Connected');
  createDefaultUsers(); // Ensure database is connected before creating users
}).catch(err => {
  console.error('❌ MongoDB Connection Failed:', err);
  process.exit(1);
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON payloads

// Routes
app.use('/api/auth', require('./Routes/authRoutes')); // Authentication routes
app.use('/api/users', require('./Routes/UserRoutes')); // User-related routes
app.use('/api/payments', require('./Routes/PaymentRoutes')); // Payment-related routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Function to create default admin, manager, and client users
const createDefaultUsers = async () => {
  try {
    const users = [
      { username: 'Gamage Recruiters', email: 'admin@gamage.com', role: 'Admin', mobileNumber: '0000000000', password: '1234' },
      { username: 'Manager 01', email: 'manager@gamage.com', role: 'Manager', mobileNumber: '0000000001', password: '1234' },
      { username: 'Manager 02', email: 'manager2@gamage.com', role: 'Manager', mobileNumber: '0000000002', password: '1234' },
      { username: 'Client 01', email: 'cbl@gmail.com', role: 'Client', mobileNumber: '0000000003', password: '1234' }
    ];

    for (const userData of users) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        const hashedPassword = await bcrypt.hash(userData.password, 10); // Hash the password
        const newUser = new User({ ...userData, password: hashedPassword });
        await newUser.save();
        console.log(`✅ ${userData.role} user (${userData.email}) created`);
      } else {
        console.log(`ℹ️ ${userData.role} user (${userData.email}) already exists`);
      }
    }
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  }
};

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
