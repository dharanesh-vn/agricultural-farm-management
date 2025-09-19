const Inventory = require('../models/Inventory');

const checkFarmerRole = (req, res) => {
    if (req.user.role !== 'farmer') {
        res.status(403).json({ message: 'Forbidden: Access is restricted to Farmers only.' });
        return false;
    }
    return true;
};

const getInventory = async (req, res, next) => {
    if (!checkFarmerRole(req, res)) return;
    try {
        const inventory = await Inventory.find({ user: req.user.id });
        res.json(inventory);
    } catch (error) { next(error); }
};

const addInventoryItem = async (req, res, next) => {
    if (!checkFarmerRole(req, res)) return;
    try {
        const { itemName, quantity, unit, lowStockThreshold } = req.body;
        const item = new Inventory({ user: req.user.id, itemName, quantity, unit, lowStockThreshold });
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) { next(error); }
};

const updateInventoryItem = async (req, res, next) => {
    if (!checkFarmerRole(req, res)) return;
    try {
        const item = await Inventory.findById(req.params.id);
        if (item && item.user.toString() === req.user.id) {
            item.itemName = req.body.itemName || item.itemName;
            item.quantity = req.body.quantity || item.quantity;
            item.unit = req.body.unit || item.unit;
            item.lowStockThreshold = req.body.lowStockThreshold || item.lowStockThreshold;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404);
            throw new Error('Item not found or user not authorized');
        }
    } catch (error) { next(error); }
};

const deleteInventoryItem = async (req, res, next) => {
    if (!checkFarmerRole(req, res)) return;
    try {
        const item = await Inventory.findById(req.params.id);
        if (item && item.user.toString() === req.user.id) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404);
            throw new Error('Item not found or user not authorized');
        }
    } catch (error) { next(error); }
};

module.exports = { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem };