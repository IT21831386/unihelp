const express = require('express');
const router = express.Router();
const marketplaceController1 = require('../Controller/marketplaceController');

router.get("/", marketplaceController1.getAllItem);
router.post("/", marketplaceController1.addItem);
router.get("/:id", marketplaceController1.getItemById);
router.put("/:id", marketplaceController1.updateItem);
router.delete("/:id", marketplaceController1.deleteItem);

module.exports = router;