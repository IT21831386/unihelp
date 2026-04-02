const express = require('express');
const router = express.Router();
const { addBoardingPlace, getBoardings, getBoardingById, updateBoarding, deleteBoarding } = require('../controllers/boardingController');

// Route to create a new boarding place
// Can add auth/admin protection middleware here later if needed
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
