const express = require("express");
const router = express.Router();
const memberController = require("../controllers/membersController/memberEndPoint");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

router.get("/", memberController.showMembers);
router.post("/one", memberController.showonemember);

//router.post("/loginMember", memberController.login);

router.use(auth);

router.post(
  "/addMember",
  // [check("name", "name is Required").not().isEmpty()],
  // [check("designation", "designation is Required").not().isEmpty()],
  // [check("image", "image is Required").not().isEmpty()],
  // [check("domain", "domain is Required").not().isEmpty()],
  // [check("year", "year is Required").not().isEmpty()],
  // [check("bio", "bio is Required").not().isEmpty()],
  // [check("linkedin", "linkedin is Required").not().isEmpty()],
  // [check("github", "github is Required").not().isEmpty()],
  // [check("insta", "insta is Required").not().isEmpty()],
  // [check("branch", "branch is Required").not().isEmpty()],
  // [check("email", "email is Required").not().isEmpty()],
  // [check("password", "password is Required").not().isEmpty()],
  memberController.addMembers
);

router.patch("/changePassword", memberController.changePassword);

router.patch("/updateMember/:id", memberController.updateMembers);

router.delete("/removeMember/:id", memberController.removeMembers);
router.post("/MemUpdate/", memberController.MemUpdate);

router.get("/memberList", memberController.memberList);
router.post("/memberProject", memberController.getProject);

module.exports = router;
