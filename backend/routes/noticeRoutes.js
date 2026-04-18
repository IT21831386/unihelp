const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'notices.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'data'));
}

// Ensure file exists with empty array
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Helper to read data
const readData = () => {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Get all notices
router.get('/', (req, res) => {
  try {
    const notices = readData();
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single notice by ID
router.get('/:id', (req, res) => {
  try {
    const notices = readData();
    const notice = notices.find(n => n._id === req.params.id);
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.status(200).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create notice
router.post('/', (req, res) => {
  try {
    const notices = readData();
    const notice = { ...req.body, _id: Date.now().toString(), createdAt: new Date().toISOString() };
    notices.unshift(notice); // Newest first
    writeData(notices);
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update notice
router.put('/:id', (req, res) => {
  try {
    const notices = readData();
    const index = notices.findIndex(n => n._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Notice not found" });
    
    notices[index] = { ...notices[index], ...req.body, updatedAt: new Date().toISOString() };
    writeData(notices);
    res.status(200).json(notices[index]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete notice
router.delete('/:id', (req, res) => {
  try {
    const notices = readData();
    const index = notices.findIndex(n => n._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Notice not found" });
    
    notices.splice(index, 1);
    writeData(notices);
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
