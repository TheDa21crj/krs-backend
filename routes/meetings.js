const express = require("express");
const auth = require("../middleWare/auth");
const router = express.Router();
const meetingController = require("../controllers/meeting/meetingController");

//Route for getting all mettings
router.get("/", meetingController.getMeetings);

//Authorized users only allowed to use the methods below
router.use(auth);

//Route for adding a meeting
router.post("/add", meetingController.addMeeting);

//Route for updating a meeting
router.patch("/update", meetingController.updateMeeting);

//Route for deleting a meeting
router.delete("/delete/:id", meetingController.deleteMeeting);

module.exports = router;
