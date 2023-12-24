const express = require("express");
const auth = require("../middleWare/auth");
const eventController = require("../controllers/event/eventController");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/", eventController.getEvents);
router.get("/home", eventController.getEventsHome);
router.get("/list", eventController.getEventsList);
router.get("/checkform/:eid", eventController.checkform);
router.get("/id/:eid", eventController.getEventsById);
router.use(auth);
router.post(
  "/addEvent",
  // [
  //   check("title", "title is Required").not().isEmpty(),
  //   check("subtitle", "subtitle is Required").not().isEmpty(),
  //   check("description", "description is Required").not().isEmpty(),
  //   check("venue", "venue is Required").not().isEmpty(),
  //   check("mode", "mode is Required").not().isEmpty(),
  //   check("teamsize", "teamsize is Required").not().isEmpty(),
  //   check("teamcreation", "teamcreation is Required").not().isEmpty(),
  //   check("date", "date is Required").not().isEmpty(),
  //   check("img1", "img1 is Required").not().isEmpty(),
  //   check("img2", "img2 is Required").not().isEmpty(),
  //   check("img3", "img3 is Required").not().isEmpty(),
  //   check("status", "status is Required").not().isEmpty(),
  //   check("sheetid", "sheetId is Required").not().isEmpty(),
  //   check("price", "price is Required").not().isEmpty(),
  // ],
  eventController.addEvent
);
router.patch("/editEvent/:eid", eventController.editEvent);

router.delete("/deleteEvent/:eid", eventController.deleteEvent);

module.exports = router;
