const event = require("../../models/eventsSchema");
const HttpError = require("../../models/HttpError");
const { check, validationResult } = require("express-validator");
const dotenv = require("dotenv");
var MongoClient = require("mongodb").MongoClient;
dotenv.config();

const getEvents = async (req, res, next) => {
  var events;

  try {
    events = await event.find({}).sort({ date: "desc" }).lean();
    events.map((e) => {
      e["img3"] = e.thumbnil[2];
      e["img2"] = e.thumbnil[1];
      e["img1"] = e.thumbnil[0];
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
    console.log(err);
  }
};

const getEventsHome = async (req, res, next) => {
  var events;

  try {
    events = await event.find({}).lean().sort({ date: "desc" }).limit(3);
    events.map((e) => {
      e["img3"] = e.thumbnil[2];
      e["img2"] = e.thumbnil[1];
      e["img1"] = e.thumbnil[0];
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
    console.log(err);
  }
};

const getEventsList = async (req, res, next) => {
  var events;

  try {
    events = await event.find({}).lean();
    const list = events.map((e) => ({ title: e.title, id: e._id.toString() }));
    res.status(200).json({ list: list });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
    console.log(err);
  }
};

const checkform = async (req, res, next) => {
  var events;

  try {
    const eventId = req.params.eid;
    events = await event.findById(eventId);
    console.log(events);

    try {
      if (events.registrationformid) {
        res.status(200).json({ exist: true });
      } else {
        throw new Error("good");
      }
    } catch (e) {
      console.log("yo");
      res.status(200).json({ exist: false });
    }
  } catch (err) {
    res.status(500).json({ msg: "Error" });
    console.log(err);
  }
};

const getEventsById = async (req, res, next) => {
  let events;
  try {
    const eventId = req.params.eid;
    events = await event.findById(eventId);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

const addEvent = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      venue,
      mode,
      teamsize,
      teamcreation,
      date,
      img1,
      img2,
      img3,
      status,
      sheetid,
      price,
    } = req.body;

    if (res.locals.userData.userLevel == "admin") {
      let newEvent;

      newEvent = new event({
        title,
        subtitle,
        description,
        venue,
        mode,
        teamcreation,
        teamsize,
        date,
        formid: [],
        thumbnil: [img1, img2, img3],
        reasultlink: "",
        status,
        price,
        sheetid: sheetid,
      });
      try {
        console.log(newEvent);
        const saveit = await newEvent.save();

        MongoClient.connect(process.env.DB_URI, function (err, db) {
          if (err) throw err;
          var dbo = db.db(process.env.SHEET_BUG);
          dbo.createCollection(title, function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
          });
        });

        res.status(200).json({ success: true, data: saveit._id.toString() });
      } catch (err) {
        console.log(err);
        const error = new HttpError("Cannot add event", 400);
        return next(error);
      }
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

const editEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eid;
    if (res.locals.userData.userLevel == "admin") {
      let getEvent;
      try {
        getEvent = await event.findById(eventId);
      } catch (err) {
        const error = new HttpError("Error finding Event id ", 404);
        return next(error);
      }
      let title,
        subtitle,
        mode,
        description,
        price,
        teamcreation,
        teamsize,
        venue,
        date,
        img1,
        img2,
        img3,
        status,
        sheetid,
        reasultlink;
      if (getEvent) {
        ({
          title,
          subtitle,
          description,
          venue,
          mode,
          teamcreation,
          teamsize,
          price,
          date,
          img1,
          img2,
          img3,
          status,
          sheetid,
          reasultlink,
        } = req.body);
        console.log(req.body);
      } else {
        const error = new HttpError("Event with this id not found", 404);
        return next(error);
      }
      getEvent.title = title;
      getEvent.subtitle = subtitle;
      getEvent.description = description;
      getEvent.venue = venue;
      getEvent.mode = mode;
      getEvent.teamcreation = teamcreation;
      getEvent.teamsize = teamsize;
      getEvent.date = date;
      getEvent.thumbnil = [img1, img2, img3];
      getEvent.status = status;
      getEvent.price = price;
      getEvent.reasultlink = reasultlink;
      getEvent.sheetid = sheetid;

      try {
        await getEvent.save();
        res.status(200).json({ success: true });
      } catch (err) {
        const error = new HttpError("Error saving the updated event", 401);
        console.log(err);
        return next(error);
      }
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eid;

    if (res.locals.userData.userLevel == "admin") {
      try {
        const getEvent = await event.findById(eventId);

        if (getEvent) {
          await getEvent.remove();
        } else {
          const error = new HttpError("Event with Id can't be deleted", 401);
          return next(error);
        }
      } catch (e) {}
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

exports.getEvents = getEvents;
exports.getEventsList = getEventsList;
exports.checkform = checkform;
exports.getEventsById = getEventsById;
exports.addEvent = addEvent;
exports.editEvent = editEvent;
exports.deleteEvent = deleteEvent;
exports.getEventsHome = getEventsHome;
