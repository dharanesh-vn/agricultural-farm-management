const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');

router.route('/')
    .get(protect, getInventory)
    .post(protect, addInventoryItem);

router.route('/:id')
    .put(protect, updateInventoryItem)
    .delete(protect, deleteInventoryItem);

module.exports = router;