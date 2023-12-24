const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  linkedin: {
    type: "String",
    required: true,
  },
  github: {
    type: "String",
    required: true,
  },
  insta: {
    type: "String",
    required: true,
  },
  year: {
    type: "String",
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    default: null,
    // required: true,
  },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
    default: "12345",
  },
  project: [{ type: mongoose.Types.ObjectId, default: [], ref: "projects" }],
});

memberSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  // if(this.isModified('password')){

  // }
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const memberList = new mongoose.model("memberList", memberSchema);

module.exports = memberList;
