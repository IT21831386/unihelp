const express = require('express');
const router = express.Router();
const { addBoardingPlace, getBoardings } = require('../controllers/boardingController');

// Route to create a new boarding place
// Can add auth/admin protection middleware here later if needed
router.post('/', addBoardingPlace);

// Route to get all boardings
router.get('/', getBoardings);

module.exports = router;
