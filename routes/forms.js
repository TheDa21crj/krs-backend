const express = require("express");
const router = express.Router();
const auth = require("../middleWare/auth");
const formController = require("../controllers/form/formController");
const { check, validationResult } = require("express-validator");

router.get("/getForms/", formController.getForms);
router.get("/getForms/:id", formController.getFormsById);
router.use(auth);
router.post(
  "/createForms",
  [
    check("heading", "heading is Required").not().isEmpty(),
    check("subtitle", "subtitle is Required").not().isEmpty(),
    check("instruction", "instruction is Required").not().isEmpty(),
    check("fields", "fields is Required").not().isEmpty(),
    check("typeofform", "typeofform is Required").not().isEmpty(),
    check("eventid", "eventid is Required").not().isEmpty(),
  ],
  formController.createForms
);
router.delete("/deleteForms/:fid", formController.deleteForms);
router.patch(
  "/editForms/:fid",
  [
    check("subtitle", "subtitle is Required").not().isEmpty(),
    check("instruction", "instruction is Required").not().isEmpty(),
    check("heading", "heading is Required").not().isEmpty(),
  ],
  formController.editForms
);
//router.patch('/editField/:fid',formController.editField)
// router.post('/addField/:fid',formController.addField)
// router.delete('/deleteField/:fid',formController.deleteField)

module.exports = router;
