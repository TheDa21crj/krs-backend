const express = require("express");
const auth = require("../middleWare/auth");
const projectController = require("../controllers/project/projectController");
const router = express.Router();
const { check } = require("express-validator");

router.get("/", projectController.getProjects);
router.use(auth);
router.post(
  "/addProject",
  [
    check("name", "name is Required").not().isEmpty(),
    check("description", "description is Required").not().isEmpty(),
    check("image", "image is Required").not().isEmpty(),
    check("member", "member is Required").not().isEmpty(),
  ],
  projectController.addProject
);
router.patch(
  "/editProject/:pid",
  [
    check("name", "name is Required").not().isEmpty(),
    check("description", "description is Required").not().isEmpty(),
    check("image", "image is Required").not().isEmpty(),
    check("member", "member is Required").not().isEmpty(),
  ],
  projectController.editProject
);
router.delete("/deleteProject/:pid", projectController.deleteProject);

module.exports = router;
