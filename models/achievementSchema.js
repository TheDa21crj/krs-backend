const mongoose = require("mongoose");
const achievementSchema = new mongoose.Schema({
  teamname: {
    type: String,
    required: true,
  },
  competitionname: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  teammembers: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const achievementList = new mongoose.model("achievement", achievementSchema);

module.exports = achievementList;
