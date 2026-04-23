const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// Get all notices
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single notice by ID
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.status(200).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create notice
router.post('/', async (req, res) => {
  try {
    const newNotice = new Notice(req.body);
    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update notice
router.put('/:id', async (req, res) => {
  try {
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNotice) return res.status(404).json({ error: "Notice not found" });
    res.status(200).json(updatedNotice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete notice
router.delete('/:id', async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
    if (!deletedNotice) return res.status(404).json({ error: "Notice not found" });
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
