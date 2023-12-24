const alumniMember = require("../../models/alumniSchema");
const { check, validationResult } = require("express-validator");
const HttpError = require("../../models/HttpError");

const getAlumni = async (req, res, next) => {
  let people;
  try {
    people = await alumniMember.find({});
  } catch (err) {
    console.log("Error showing members");
  }
  res.json(people);
};

const postAlumni = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, designation, image, domain, social, year, bio, branch, email } =
    req.body;
  console.log(name);

  var checkUser;
  try {
    checkUser = await alumniMember.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed Try again later", 400);
    return next(error);
  }

  if (checkUser) {
    const error = new HttpError("Email already exist", 400);
    return next(error);
  }

  const newAlumni = new alumniMember({
    name,
    designation,
    image,
    domain,
    social,
    year,
    bio,
    branch,
    email,
  });
  try {
    // console.log(newMember)
    await newAlumni.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot add member", 400);
    return next(error);
  }
  res.status(200).json({ message: "Member added" });
};

const updateMember = async (req, res, next) => {
  let { email } = req.params.email;
  console.log(email);
  let getUser;
  try {
    getUser = await users.findOne(email);
  } catch (err) {
    console.log("Searching failed");
  }
  // let name,email,password
  if (getUser) {
    // ({name,email,password}) = req.body
    console.log("Email recognised");
    let { name, email, password } = req.body;
    // getUser.id = id;
    getUser.name = name;
    getUser.email = email;
    getUser.password = password;

    await getUser.save();
  } else {
    const error = new HttpError("User with Id not found", 404);
    return next(error);
  }
  res.status(200).json(getUser);
};

const removeMember = async (req, res, next) => {
  // const id = req.params._id
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

exports.getAlumni = getAlumni;
exports.postAlumni = postAlumni;
exports.updateMember = updateMember;
exports.removeMember = removeMember;
