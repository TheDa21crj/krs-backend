const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  //Name of the inventory item
  name: {
    type: String,
    required: true,
  },
  //Number of the item
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: (props) => `${props.value} is not an integer value`,
    },
  },
  //Image URL for the item
  image: {
    type: String,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Minna.photowalk_DJI_Drone_15.jpg/640px-Minna.photowalk_DJI_Drone_15.jpg',
    validate: {
      validator: (v) =>
        /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim.test(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  //Issuer of the item (id)
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'memberList',
  },
  //Tags for the item
  tags: [String],
  //Owner of the item (id)
  ownedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'memberList',
  },
  //Remarks for the item
  remarks: String,
});

const inventoryItem = mongoose.model('inventoryItem', inventoryItemSchema);

module.exports = inventoryItem;
