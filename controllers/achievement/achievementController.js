const HttpError = require("../../models/HttpError");
const achievementModel = require("../../models/achievementSchema");
const dotenv = require("dotenv");

dotenv.config();
const createachievement = async (req, res, next) => {
  try {
    const {
      teamname,
      competitionname,
      year,
      position,
      teammembers,
      image1,
      image2,
      location,
    } = req.body;

    //validation
    if (res.locals.userData.userLevel == "admin") {
      if (!teamname) {
        return res.send({ error: "team name is require" });
      }
      if (!competitionname) {
        return res.send({ error: "competition name is require" });
      }
      if (!year) {
        return res.send({ error: "year is require" });
      }
      if (!position) {
        return res.send({ error: "position is require" });
      }
      if (!teammembers) {
        return res.send({ error: "team members name is require" });
      }
      if (!image1) {
        return res.send({ error: "image is require" });
      }
      if (!image2) {
        return res.send({ error: "image is require" });
      }
      if (!location) {
        return res.send({ error: "location is require" });
      }
      const newachievement = await new achievementModel({
        teamname,
        competitionname,
        year,
        position,
        teammembers,
        image1,
        image2,
        location,
      }).save();
      res.status(201).send({
        success: true,
        message: "achievement created successfully",
        newachievement,
      });
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create achievement form",
      error,
    });
  }
};

const editAchievement = async (req, res, next) => {
  try {
    const achievementId = req.params.id;
    if (res.locals.userData.userLevel == "admin") {
      let getAchievement;
      try {
        getAchievement = await achievementModel.findById(achievementId);
      } catch (err) {
        const error = new HttpError("Error finding achievement id", 404);
        return next(error);
      }
      let teamname,
        competitionname,
        year,
        position,
        teammembers,
        image1,
        image2,
        location;
      if (getAchievement) {
        ({
          teamname,
          competitionname,
          year,
          position,
          teammembers,
          image1,
          image2,
          location,
        } = req.body);
        console.log(req.body);
      } else {
        const error = new HttpError("achievement with this id not found", 404);
        return next(error);
      }
      getAchievement.teamname = teamname;
      getAchievement.competitionname = competitionname;
      getAchievement.year = year;
      getAchievement.position = position;
      getAchievement.teammembers = teammembers;
      getAchievement.image1 = image1;
      getAchievement.image2 = image2;
      getAchievement.location = location;
      try {
        await getAchievement.save();
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
    console.log(e);
  }
};

const getAchievement = async (req, res, next) => {
  try {
    const achieve = await achievementModel.find({});
    res.status(200).send({
      Success: true,
      message: "all achievement list",
      achieve,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all achievements",
    });
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const teamname = req.params.teamname;
    if (res.locals.userData.userLevel == "admin") {
      await achievementModel.deleteOne({ teamname: teamname });
      res.status(200).send({
        success: true,
        message: "achievement deleted successfully",
      });
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting acievement",
      error,
    });
  }
};
exports.createachievement = createachievement;
exports.editAchievement = editAchievement;
exports.deleteAchievement = deleteAchievement;
exports.getAchievement = getAchievement;
