const recruits = require("../../models/recruitsSchema");
const HttpError = require("../../models/HttpError");
const { check, validationResult } = require("express-validator");

const getRecruits = async (req, res, next) => {
  let people;
  try {
    people = await recruits.find({});
  } catch (err) {
    console.log("Error showing members");
  }
  res.json(people);
};

const postRecruits = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, domain, social, year, branch, email } = req.body;
  console.log(name);

  let checkUser;
  try {
    checkUser = await recruits.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("ERROR Comparing with old recruits", 400);
    return next(error);
  }

  if (!checkUser) {
    const newRecruit = new recruits({
      name,
      domain,
      social,
      year,
      branch,
      email,
    });

    newRecruit.save();
    res.json({ message: "member created" });
  } else {
    const error = new HttpError("Member with email already exist");
    return next(error);
  }
};

const deleteRecruits = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  var findMember;
  try {
    // const findMember =await member.findOne({_id:id})
    const findMember = await member.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Member with matching ID not found", 404);
    return next(error);
  }
  var deleteMember;
  if (findMember) {
    deleteMember = await member.deleteOne({ email: email });
  }
};

exports.getRecruits = getRecruits;
exports.postRecruits = postRecruits;
exports.deleteRecruits = deleteRecruits;
