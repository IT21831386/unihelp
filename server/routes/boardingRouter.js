const express = require('express');
const router = express.Router();
const { addBoardingPlace } = require('../controllers/boardingController');

// Route to create a new boarding place
// Can add auth/admin protection middleware here later if needed
router.post('/', addBoardingPlace);

module.exports = router;
