const express = require('express');
const router = express.Router();
const marketplaceController1 = require('../controllers/marketplaceController');

router.get("/", marketplaceController1.getAllItem);
router.post("/", marketplaceController1.addItem);
router.get("/:id", marketplaceController1.getItemById);
router.put("/:id", marketplaceController1.updateItem);
router.delete("/:id", marketplaceController1.deleteItem);
router.post("/save", marketplaceController1.saveItem);
router.post("/unsave", marketplaceController1.unsaveItem);
router.get("/saved/:userId", marketplaceController1.getSavedItems);

module.exports = router;