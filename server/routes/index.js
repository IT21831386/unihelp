const express = require('express');
const router = express.Router();

// Placeholder routes
router.get('/notices', (req, res) => {
  res.json({ message: 'Get all notices' });
});

router.get('/marketplace', (req, res) => {
  res.json({ message: 'Get all marketplace items' });
});

router.get('/bookings', (req, res) => {
  res.json({ message: 'Get all bookings' });
});

router.get('/boarding', (req, res) => {
  res.json({ message: 'Get all boarding places' });
});

router.get('/careers', (req, res) => {
  res.json({ message: 'Get all career listings' });
});

module.exports = router;
