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

// Test route to verify the router is active
router.get('/test-ping', (req, res) => res.json({ message: 'Boarding router is active' }));

// Route for favorite boardings (Moved to top for priority)
router.post('/save', saveBoarding);
router.post('/unsave', unsaveBoarding);
router.get('/saved/:userId', getSavedBoardings);

// Route to create a new boarding place
router.post('/', addBoardingPlace);

// Route to get all boardings
router.get('/', getBoardings);

// Route to get single boarding
router.get('/:id', getBoardingById);

// Route to update a boarding
router.put('/:id', updateBoarding);

// Route to delete a boarding
router.delete('/:id', deleteBoarding);

module.exports = router;
