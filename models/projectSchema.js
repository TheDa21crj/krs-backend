const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  member: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "memberList",
    },
  ],
  tag: {
    type: Array,
  },
});

const projectList = new mongoose.model("projects", projectSchema);

module.exports = projectList;
