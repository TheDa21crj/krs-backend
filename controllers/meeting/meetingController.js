const HttpError = require("../../models/HttpError");
const Meeting = require("../../models/meetingSchema");

//Utility method (To be seperated later on)
const timeAndDateToDate = (time, date) => {
  let dateTime = new Date(date);
  const timeArr = time.split(":");
  dateTime.setHours(Number(timeArr[0]));
  dateTime.setMinutes(Number(timeArr[1]));
  dateTime.setSeconds(0);
  return dateTime;
};

//Controller Methods

const getMeetings = async (req, res, next) => {
  let meetings;
  try {
    meetings = await Meeting.find({});
    meetings.sort("-dataTime");
  } catch (err) {
    console.log("Some error occured accesssing meeting data");
  }
  res.json(meetings);
};

const addMeeting = async (req, res, next) => {
  if (res.locals.userData.userLevel != "admin") {
    const error = new HttpError("Access denied", 400);
    return next(error);
  }
  try {
    const { title, description, date, time, mode, venue, mom } = req.body;
    let dateTime = timeAndDateToDate(time, date);
    const meeting = new Meeting({
      title,
      description,
      dateTime,
      mode,
      venue,
      mom,
    });
    await meeting.save();
    res.json({ success: true, id: meeting._id });
  } catch (err) {
    const error = new HttpError("Meeting coundn't be created", 400);
    next(error);
  }
};

const updateMeeting = async (req, res, next) => {
  if (res.locals.userData.userLevel != "admin") {
    const error = new HttpError("Access denied", 400);
    return next(error);
  }
  try {
    const { title, description, date, time, mode, venue, mom, id } = req.body;
    let meeting = await Meeting.findById(id);
    let dateTime = timeAndDateToDate(time, date);
    meeting.title = title;
    meeting.description = description;
    meeting.dateTime = dateTime;
    meeting.mode = mode;
    meeting.venue = venue;
    meeting.mom = mom;
    meeting.markModified();
    meeting.save();
    res.json({ success: true });
  } catch (err) {
    const error = new HttpError("Couldn't be updated", 400);
    next(error);
  }
};
/*
 * Required: id in req.body
 * Returns: success
 */
const deleteMeeting = async (req, res, next) => {
  if (res.locals.userData.userLevel != "admin") {
    const error = new HttpError("Access denied", 400);
    return next(error);
  }
  try {
    const { id } = req.params;

    await Meeting.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    const error = new HttpError("Couldn't be deleted", 400);
    next(error);
  }
};

module.exports = {
  getMeetings,
  addMeeting,
  updateMeeting,
  deleteMeeting,
};
