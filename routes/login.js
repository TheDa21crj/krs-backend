const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login/loginController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

router.post("/login", loginController.login);
router.post("/glogin", loginController.glogin);
router.post("/signup", loginController.signup);
router.post("/forgotPassword/otpValidate", loginController.checkOtp);
router.post(
  "/resetPassword/",
  [
    check("password", "password is Required").not().isEmpty(),
    check("cpassword", "Conform Password is Required").not().isEmpty(),
    check("email", "email is Required").not().isEmpty(),
  ],
  loginController.resetPassword
);
router.post("/forgotPassword/sendEmail/:email", loginController.checkEmail);
router.use(auth);
router.post("/getlevel", loginController.getLevel);

module.exports = router;
