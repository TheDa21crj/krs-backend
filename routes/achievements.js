const express = require("express");
const achievementController = require("../controllers/achievement/achievementController");
const auth = require("../middleWare/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/getAllAchievement", achievementController.getAchievement);

router.use(auth);

router.post("/CreateAchievements", achievementController.createachievement);
router.patch("/editAchievement/:id", achievementController.editAchievement);
router.delete(
  "/deleteAchievement/:teamname",
  achievementController.deleteAchievement
);

module.exports = router;
