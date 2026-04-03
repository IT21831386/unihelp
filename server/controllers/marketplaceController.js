const marketplace = require('../Model/marketplaceModel.js');

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
    const { itemName, category, condition, description, price, isNegotiable, photos, showContact, phone } = req.body;
    let item;
    try {
        item = new marketplace({
            itemName, category, condition, description,
            price, isNegotiable, photos, showContact, phone
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

exports.getAllItem = getAllItems;
exports.addItem = addItem;
exports.getItemById = getItemById;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;