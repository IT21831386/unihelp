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

const getBoardingById = async (id) => {
  try {
    const boarding = await Boarding.findById(id);
    return boarding;
  } catch (error) {
    throw error;
  }
};

const updateBoarding = async (id, updateData) => {
  try {
    const updatedBoarding = await Boarding.findByIdAndUpdate(id, updateData, { new: true });
    return updatedBoarding;
  } catch (error) {
    throw error;
  }
};

const deleteBoarding = async (id) => {
  try {
    const deletedBoarding = await Boarding.findByIdAndDelete(id);
    return deletedBoarding;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBoarding,
  getAllBoardings,
  getBoardingById,
  updateBoarding,
  deleteBoarding
};
