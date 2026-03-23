const boardingService = require('../services/boardingService');

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

module.exports = {
  addBoardingPlace,
  getBoardings,
};
