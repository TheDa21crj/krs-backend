const express = require("express");
const router = express.Router();
const auth = require("../middleWare/auth");
const registrationController = require("../controllers/registration/registrationController");
const { check, validationResult } = require("express-validator");

router.post(
  "/register/checkreg/",
  [
    check("email", "email is Required").not().isEmpty(),
    // check("sheetid", "sheetid is Required").not().isEmpty(),
    check("formid", "formid is Required").not().isEmpty(),
  ],
  registrationController.checkReg
);
// router.post(
//   "/register/checkclassesreg/",
//   [
//     check("email", "email is Required").not().isEmpty(),
//     // check("sheetid", "sheetid is Required").not().isEmpty(),
//     check("formid", "formid is Required").not().isEmpty(),
//   ],
//   registrationController.checkClassesReg
// );
router.post(
  "/register/createOrder/",
  [check("price", "price is Required").not().isEmpty()],
  registrationController.createOrder
);

//router.get("/register/qrcheck/", registrationController.qrcheck);
router.post("/register/counter/", registrationController.Regcounter);

router.use(auth);
router.post("/register/submition/:fid", registrationController.submition);

router.post(
  "/register/createteam/",
  [
    check("email", "email is Required").not().isEmpty(),
    // check("sheetid", "sheetid is Required").not().isEmpty(),
    check("formid", "formid is Required").not().isEmpty(),
  ],
  registrationController.createteam
);

router.post(
  "/register/jointeam/",
  [
    check("email", "email is Required").not().isEmpty(),
    check("code", "code is Required").not().isEmpty(),
    // check("sheetid", "sheetid is Required").not().isEmpty(),
    check("formid", "formid is Required").not().isEmpty(),
  ],
  registrationController.jointeam
);

router.post(
  "/register/leaveteam/",
  [
    check("email", "email is Required").not().isEmpty(),
    check("code", "code is Required").not().isEmpty(),
    // check("sheetid", "sheetid is Required").not().isEmpty(),
    check("formid", "formid is Required").not().isEmpty(),
  ],
  registrationController.leaveteam
);

router.post(
  "/register/verify/",
  [
    check("code", "code is Required").not().isEmpty(),
    // check("sheetid", "sheetid is Required").not().isEmpty(),
    check("formid", "formid is Required").not().isEmpty(),
    check("type", "type is Required").not().isEmpty(),
  ],
  registrationController.verify
);

router.post(
  "/register/teamstatus/",
  [
    check("email", "email is Required").not().isEmpty(),
    // check("sheetid", "sheetid is Required").not().isEmpty(),
    check("formid", "formid is Required").not().isEmpty(),
  ],
  registrationController.teamstatus
);

module.exports = router;
