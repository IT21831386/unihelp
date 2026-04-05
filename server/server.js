require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const boardingRoutes = require('./routes/boardingRouter');
const jobRoutes = require('./routes/jobRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boardings', boardingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to UniHelp API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UniHelp server is running on port ${PORT}`);
});
