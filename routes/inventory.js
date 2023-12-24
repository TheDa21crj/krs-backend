const express = require('express');
const auth = require('../middleWare/auth');
const router = express.Router();
const inventoryController = require('../controllers/inventory/inventoryController');

//Route for getting all inventory items
router.get('/get', inventoryController.getAllItems);

//Authorized users only allowed to use the methods below
router.use(auth);

//Route for adding an inventory item
router.post('/add', inventoryController.addItem);

//Route for updating an inventory item
router.patch('/update', inventoryController.updateItem);

//Route for deleting an inventory item
router.delete('/delete', inventoryController.deleteItem);

module.exports = router;
