const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  //Stores the title/name of the meeting
  title: {
    type: String,
    required: true,
  },
  //Describes the meeting
  description: {
    type: String,
    required: true,
  },
  //Stores the start time and date of the meeting
  dateTime: {
    type: Date,
    required: true,
  },
  //Stores the mode of the meeting (Offline/Online)
  mode: {
    type: String,
    required: true,
    enum: ["Online", "Offline"],
  },
  //Stores the meeting's link in online mode and the venue in offline mode
  venue: {
    type: String,
    required: true,
  },
  //Stores the MOM of the meeting
  mom: {
    type: String,
    required: true,
    default: "Enter the details of MOM here.",
  },
});

const meeting = mongoose.model("meeting", meetingSchema);

module.exports = meeting;
