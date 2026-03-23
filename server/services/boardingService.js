const Boarding = require('../models/boardingModel');

// Create a new boarding
const createBoarding = async (boardingData) => {
  try {
    const newBoarding = await Boarding.create(boardingData);
    return newBoarding;
  } catch (error) {
    throw error;
  }
};

// Get all boardings
const getAllBoardings = async () => {
  try {
    const boardings = await Boarding.find().sort({ createdAt: -1 });
    return boardings;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBoarding,
  getAllBoardings,
};
