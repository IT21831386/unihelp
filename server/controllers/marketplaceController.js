const marketplace = require('../models/marketplaceModel');
const User = require('../models/User');

const getAllItems = async (req, res, next) => {
    let items;
    try {
        items = await marketplace.find();
    } catch (err) {
        console.log(err);
    }
    if (!items) {
        return res.status(404).json({ message: "No items found" });
    }
    return res.status(200).json({ items });
};

const addItem = async (req, res, next) => {
    const { 
        itemName, category, condition, description, 
        price, isNegotiable, photos, showContact, 
        phone, sellerId, sellerName 
    } = req.body;
    let item;
    try {
        item = new marketplace({
            itemName, category, condition, description,
            price, isNegotiable, photos, showContact, 
            phone, sellerId, sellerName
        });
        await item.save();
    } catch (err) {
        console.log(err);
    }
    if (!item) {
        return res.status(404).json({ message: "Unable to add item" });
    }
    return res.status(200).json({ item });
};

const getItemById = async (req, res, next) => {
    const id = req.params.id;
    let item;
    try {
        item = await marketplace.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ item });
};

const updateItem = async (req, res, next) => {
    const id = req.params.id;
    const { itemName, category, condition, description, price, isNegotiable, photos, showContact, phone } = req.body;
    let item;
    try {
        item = await marketplace.findByIdAndUpdate(
            id,
            { itemName, category, condition, description, price, isNegotiable, photos, showContact, phone },
            { new: true }
        );
    } catch (err) {
        console.log(err);
    }
    if (!item) {
        return res.status(404).json({ message: "Unable to update item" });
    }
    return res.status(200).json({ item });
};

const deleteItem = async (req, res, next) => {
    const id = req.params.id;
    let item;
    try {
        item = await marketplace.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!item) {
        return res.status(404).json({ message: "Unable to delete item" });
    }
    return res.status(200).json({ message: "Item deleted successfully" });
};

const saveItem = async (req, res) => {
    const { userId, itemId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.savedItems.includes(itemId)) {
            return res.status(400).json({ message: "Item already saved" });
        }

        user.savedItems.push(itemId);
        await user.save();
        return res.status(200).json({ message: "Item saved successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const unsaveItem = async (req, res) => {
    const { userId, itemId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.savedItems = user.savedItems.filter(id => id.toString() !== itemId);
        await user.save();
        return res.status(200).json({ message: "Item removed from saved items" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getSavedItems = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).populate('savedItems');
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ items: user.savedItems });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllItem = getAllItems;
exports.addItem = addItem;
exports.getItemById = getItemById;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.saveItem = saveItem;
exports.unsaveItem = unsaveItem;
exports.getSavedItems = getSavedItems;