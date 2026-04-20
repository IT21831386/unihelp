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
const bookingRoutes = require('./routes/bookingRoutes');
const areaRoutes = require('./routes/areaRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoute');
const conversationRoutes = require('./routes/conversationRoute');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boardings', boardingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/conversations', conversationRoutes);

// Expose uploads directory to frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
