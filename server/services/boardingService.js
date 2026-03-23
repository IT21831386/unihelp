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

// You can add more service functions (get, update, delete) here later.

module.exports = {
  createBoarding,
};
