const express = require("express");
const router = express.Router();
const alumniController = require("../controllers/membersController/alumniEndPoint");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

router.get("/", alumniController.getAlumni);

router.use(auth);

router.post(
  "/addAlumni",
  [
    check("name", "name is Required").not().isEmpty(),
    check("designation", "designation is Required").not().isEmpty(),
    check("image", "image is Required").not().isEmpty(),
    check("social", "social is Required").not().isEmpty(),
    check("year", "year is Required").not().isEmpty(),
    check("bio", "bio is Required").not().isEmpty(),
    check("branch", "branch is Required").not().isEmpty(),
    check("email", "email is Required").not().isEmpty(),
  ],
  alumniController.postAlumni
);
router.patch("/updateMember/:email", alumniController.updateMember);
router.delete("/removeMember/:email", alumniController.removeMember);

module.exports = router;
