const boardingService = require('../services/boardingService');
const User = require('../models/User');

// @desc    Add a new boarding place
// @route   POST /api/boardings
// @access  Private/Admin (Authentication middleware can be added later)
const addBoardingPlace = async (req, res) => {
  try {
    const boardingData = req.body;
    
    const newBoarding = await boardingService.createBoarding(boardingData);
    
    res.status(201).json({
      success: true,
      data: newBoarding,
      message: 'Boarding place created successfully',
    });
  } catch (error) {
    console.error('Error in addBoardingPlace:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while creating boarding place',
    });
  }
};

// @desc    Get all boardings
// @route   GET /api/boardings
// @access  Public
const getBoardings = async (req, res) => {
  try {
    const boardings = await boardingService.getAllBoardings();
    
    res.status(200).json({
      success: true,
      count: boardings.length,
      data: boardings,
    });
  } catch (error) {
    console.error('Error in getBoardings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while fetching boardings',
    });
  }
};

// @desc    Get a single boarding by ID
// @route   GET /api/boardings/:id
// @access  Public
const getBoardingById = async (req, res) => {
  try {
    const boarding = await boardingService.getBoardingById(req.params.id);
    if (!boarding) {
      return res.status(404).json({ success: false, message: 'Boarding place not found' });
    }
    res.status(200).json({ success: true, data: boarding });
  } catch (error) {
    console.error('Error in getBoardingById:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update a boarding place
// @route   PUT /api/boardings/:id
// @access  Private/Admin
const updateBoarding = async (req, res) => {
  try {
    const boarding = await boardingService.updateBoarding(req.params.id, req.body);
    if (!boarding) {
      return res.status(404).json({ success: false, message: 'Boarding place not found' });
    }
    res.status(200).json({ success: true, data: boarding, message: 'Boarding place updated successfully' });
  } catch (error) {
    console.error('Error in updateBoarding:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Delete a boarding place
// @route   DELETE /api/boardings/:id
// @access  Private/Admin
const deleteBoarding = async (req, res) => {
  try {
    const boarding = await boardingService.deleteBoarding(req.params.id);
    if (!boarding) {
      return res.status(404).json({ success: false, message: 'Boarding place not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Boarding place deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBoarding:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Save a boarding to favorites
// @route   POST /api/boardings/save
// @access  Private
const saveBoarding = async (req, res) => {
  try {
    const { userId, boardingId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.savedBoardings.includes(boardingId)) {
      user.savedBoardings.push(boardingId);
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Boarding saved to favorites', savedBoardings: user.savedBoardings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a boarding from favorites
// @route   POST /api/boardings/unsave
// @access  Private
const unsaveBoarding = async (req, res) => {
  try {
    const { userId, boardingId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.savedBoardings = user.savedBoardings.filter(id => id.toString() !== boardingId);
    await user.save();

    res.status(200).json({ success: true, message: 'Boarding removed from favorites', savedBoardings: user.savedBoardings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all saved boardings for a user
// @route   GET /api/boardings/saved/:userId
// @access  Private
const getSavedBoardings = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedBoardings');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, count: user.savedBoardings.length, data: user.savedBoardings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addBoardingPlace,
  getBoardings,
  getBoardingById,
  updateBoarding,
  deleteBoarding,
  saveBoarding,
  unsaveBoarding,
  getSavedBoardings
};
