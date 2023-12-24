const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    default: 0,
    // required: true
  },
  number: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    // required: true,
    default:
      "https://play-lh.googleusercontent.com/fgt7dyhffQu9eHEYf1rfrL_xYupnY4bWa1A3PUt_7xXAi5Gi6LxW3SLMaPQwEH37JV4",
  },
  year: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  eventid: [{ type: mongoose.Types.ObjectId, required: true, ref: "events" }],
  email: { type: String, required: true },
  password: {
    type: String,
    // required: true,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  // if(this.isModified('password')){
  // }
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userList = new mongoose.model("users", userSchema);

module.exports = userList;
