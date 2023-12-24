const express = require("express");
const router = express.Router();
const recruitsController = require("../controllers/recruits/recruitsController");
const { check, validationResult } = require("express-validator");

router.get("/", recruitsController.getRecruits);
router.post(
  "/addRecuits",
  [check("name", "name is Required").not().isEmpty()],
  [check("domain", "domain is Required").not().isEmpty()],
  [check("social", "social is Required").not().isEmpty()],
  [check("year", "year is Required").not().isEmpty()],
  [check("branch", "branch is Required").not().isEmpty()],
  [check("email", "email is Required").not().isEmpty()],
  recruitsController.postRecruits
);
router.delete(
  "/deleteRecuits",
  check("email", "email is Required").not().isEmpty(),
  recruitsController.deleteRecruits
);

module.exports = router;
