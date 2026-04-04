const express = require('express');
const router = express.Router();
const { getAreas, updateArea } = require('../controllers/areaController');

router.get('/', getAreas);
router.put('/:categoryId', updateArea);

module.exports = router;
