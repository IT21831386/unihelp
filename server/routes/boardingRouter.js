const express = require('express');
const router = express.Router();
const { 
  addBoardingPlace, 
  getBoardings, 
  getBoardingById, 
  updateBoarding, 
  deleteBoarding, 
  saveBoarding, 
  unsaveBoarding, 
  getSavedBoardings 
} = require('../controllers/boardingController');

// Route to create a new boarding place
router.post('/', addBoardingPlace);

// Route to get all boardings
router.get('/', getBoardings);

// Route for favorite boardings
router.post('/save', saveBoarding);
router.post('/unsave', unsaveBoarding);
router.get('/saved/:userId', getSavedBoardings);

// Route to get single boarding
router.get('/:id', getBoardingById);

// Route to update a boarding
router.put('/:id', updateBoarding);

// Route to delete a boarding
router.delete('/:id', deleteBoarding);

module.exports = router;
