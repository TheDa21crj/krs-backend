const InventoryItem = require('../../models/inventoryItemSchema');
const HttpError = require('../../models/HttpError');
const Member = require('../../models/memberSchema');

/*
 * If successful, it will return an array of
 * object which contains _id, name, quantity, image, issuedBy, ownedBy, tags (array), remarks
 */
const getAllItems = async (req, res, next) => {
  try {
    let items = await InventoryItem.find({});
    res.json(items);
  } catch (err) {
    res.status(400).json({ msg: "Couldn't get the inventory items" });
    console.log(err);
  }
};

/*
 * Requires {name, quantity, image, issuedBy, ownedBy, tags (array), remarks}
 * Returns {success, id}
 */
const addItem = async (req, res, next) => {
  try {
    const item = new InventoryItem(req.body);
    await item.save();
    res.json({ success: true, id: item._id });
  } catch (err) {
    const error = new HttpError("Item couldn't be created", 400);
    next(error);
  }
};

/*
 * Requires {id, name, quantity, image, issuedBy, ownedBy, tags (array), remarks}
 * Returns {success}
 */
const updateItem = async (req, res, next) => {
  try {
    const { id, name, quantity, image, issuedBy, tags, ownedBy, remarks } =
      req.body;
    const owner = await Member.findOne({
      email: res.locals.userData.userEmail,
    });
    const item = await InventoryItem.findById(id);
    if (!item.ownedBy.equals(owner._id)) {
      const error = new HttpError(
        'Item could only be updated by his owner',
        400
      );
      next(error);
    }
    item.name = name;
    item.quantity = quantity;
    item.image = image;
    item.issuedBy = issuedBy;
    item.tags = tags;
    item.ownedBy = ownedBy;
    item.remarks = remarks;
    await item.save();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Item couldn't be updated", 400);
    next(error);
  }
};

/*
 * Requires {id}
 * Returns {success}
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.body;
    const owner = await Member.findOne({
      email: res.locals.userData.userEmail,
    });
    const item = await InventoryItem.findById(id);
    if (!item.ownedBy.equals(owner._id)) {
      const error = new HttpError(
        'Item could only be deleted by his owner',
        400
      );
      next(error);
    }
    item.delete();
    res.json({ success: true });
  } catch (err) {
    const error = new HttpError("Item couldn't be deleted", 400);
    next(error);
  }
};

module.exports = {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
};
