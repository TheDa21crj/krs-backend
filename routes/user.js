const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/userController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/sendEmail",
  [check("email", "email is Required").not().isEmpty()],
  [check("message", "message is Required").not().isEmpty()],
  [check("name", "name is Required").not().isEmpty()],
  userController.sendEmail
);

router.post(
  "/add",
  [check("email", "email is Required").not().isEmpty()],
  userController.AddUser
);
router.use(auth);
router.post(
  "/",
  [check("email", "email is Required").not().isEmpty()],
  userController.getUser
);

module.exports = router;
