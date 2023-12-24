const HttpError = require("../../models/HttpError");
const member = require("../../models/memberSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const showMembers = async (req, res, next) => {
  let people;
  try {
    people = await member.find({});
  } catch (err) {
    console.log("Error showing members");
  }
  res.json(people);
};

const showonemember = async (req, res, next) => {
  let people;
  let { email } = req.body;
  try {
    people = await member.findOne({ email: email });
  } catch (err) {
    console.log("Error showing members");
    const error = new HttpError("Email not found", 400);
    return next(error);
  }
  people.password = "";
  res.json(people);
};

const addMembers = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const {
    name,
    designation,
    image,
    domain,
    year,
    bio,
    linkedin,
    github,
    insta,
    branch,
    email,
    password,
  } = req.body;

  console.log(branch);

  if (true) {
    var checkUser;
    try {
      checkUser = await member.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("Signup failed Try again later", 400);
      return next(error);
    }

    if (checkUser) {
      console.log("exists alredy");
      const error = new HttpError("Email already exist", 400);
      return next(error);
    }

    let dataMember = {};
    dataMember.name = name;
    dataMember.designation = designation;
    dataMember.image = image;
    dataMember.domain = domain;
    dataMember.linkedin = linkedin;
    dataMember.github = github;
    dataMember.insta = insta;
    dataMember.year = year;
    dataMember.bio = bio;
    dataMember.branch = branch;
    dataMember.email = email;
    dataMember.password = password;

    console.log(dataMember);

    try {
      let newWish = new member(dataMember);
      await newWish.save();
    } catch (err) {
      console.log(err);
      const error = new HttpError("Cannot add member", 400);
      return next(error);
    }
    return res.status(200).json({ message: "Member added" });
    // } else {
    //   const error = new HttpError("not allowed to add member", 400);
    //   return next(error);
  }
};

const updateMembers = async (req, res, next) => {
  const id = req.params.id;

  const {
    name,
    designation,
    image,
    domain,
    year,
    bio,
    branch,
    email,
    linkedin,
    github,
    insta,
  } = req.body;

  try {
    var findMember = await member.findOne({ _id: id });

    findMember.name = name;
    findMember.designation = designation;
    findMember.image = image;
    findMember.domain = domain;
    findMember.linkedin = linkedin;
    findMember.github = github;
    findMember.insta = insta;
    findMember.year = year;
    findMember.bio = bio;
    findMember.branch = "branch";
    findMember.email = email;

    // console.log(findMember.social.linkedin);
    // console.log(findMember.social.github);
    // console.log(findMember.social.insta);

    console.log(findMember.social);

    await findMember.save();

    res.status(200).json({ message: findMember });
  } catch (err) {
    console.error(err);
  }
  // try {
  //   findMember = await member.findById({ memberId });
  // } catch (err) {
  //   const error = new HttpError("Member can't be edited", 400);
  //   return next(error);
  // }
  // findMember.name = name;
  // findMember.designation = designation;
  // findMember.image = image;
  // findMember.domain = domain;
  // // findMember.social = social;
  // findMember.year = year;
  // findMember.bio = bio;
  // findMember.email = email;
  // try {
  //   await findMember.save();
  // } catch (err) {
  //   console.log("Error while editing member " + err);
  // }
  // res.status(200).json({ check: check.toObject({ getter: true }) });
};

const removeMembers = async (req, res, next) => {
  const email = req.params.id;

  var findMember;
  try {
    const findMember = await member.findOne({ email });
    var deleteMember;
    if (findMember) {
      deleteMember = await member.deleteOne({ email: email });
    }

    res.status(202).send({ message: deleteMember });
  } catch (err) {
    const error = new HttpError("Member with matching ID not found", 404);
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { email, password, newPassword } = req.body;

  let valideEmail;
  try {
    valideEmail = await member.findOne(email);
  } catch (e) {
    console.log(e);
    const error = new HttpError("Email not found", 401);
    return next(error);
  }

  if (valideEmail) {
    const isMatch = bcrypt.compare(password, valideEmail.password);
    if (isMatch) {
      valideEmail.password = newPassword;
      valideEmail.save();
    } else {
      const error = new HttpError("Wrong Password", 401);
      return next(error);
    }
  } else {
    const error = new HttpError("Email not registered", 401);
    return next(error);
  }
};

const login = async (req, res, next) => {
  console.log("test");

  const { email, password } = req.body;
  var validateEmail;
  try {
    validateEmail = await member.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("ERROR SEARCHING EMAIL", 500);
    return next(error);
  }

  if (validateEmail) {
    const isMatch = await bcrypt.compare(password, validateEmail.password);
    if (!isMatch) {
      const error = HttpError("Wrong credentials", 400);
      return next(error);
    } else {
      let token;
      try {
        token = jwt.sign(
          {
            userId: validateEmail._id,
            userEmail: validateEmail.email,
            designation: validateEmail.designation,
          },
          process.env.JWT_SECRATE,
          { expiresIn: "1hr" }
        );
      } catch (err) {
        const error = new HttpError("Error logging user", 401);
        console.log(err);
        return next(error);
      }

      res.status(200).json({
        userId: validateEmail._id,
        useremail: validateEmail.email,
        token: token,
      });
    }
  } else {
    const error = new HttpError("Wrong Email Credentials", 400);
    return next(error);
  }
};

const MemUpdate = async (req, res, next) => {
  const { linkedin, github, insta, bio } = req.body;
  if (res.locals.userData.userLevel !== "user") {
    let email = res.locals.userData.userEmail;
    let user;
    try {
      user = await member.findOne({ email });
    } catch (e) {
      console.log(e);
      const error = new HttpError("ERROR SEARCHING EMAIL", 500);
      return next(error);
    }

    if (linkedin !== "") {
      user.linkedin = linkedin;
    }
    if (github !== "") {
      user.github = github;
    }
    if (insta !== "") {
      user.insta = insta;
    }
    if (bio !== "") {
      user.bio = bio;
    }
    try {
      await user.save();
    } catch (e) {
      console.log(e);
      const error = new HttpError("ERROR Updating", 500);
      return next(error);
    }
  }
};

//member name image and id
const memberList = async (req, res, next) => {
  let people;
  let result = [];
  try {
    people = await member.find({});
    for (var i = 0; i < people.length; i++) {
      let individual = {
        name: "",
        image: "",
        memberId: "",
      };
      individual.name = people[i].name;
      individual.image = people[i].image;
      individual.memberId = people[i]._id;
      result.push(individual);
    }
  } catch (err) {
    console.log("Error showing members");
  }
  res.json(result);
};
//member project
const getProject = async (req, res, next) => {
  let people;
  const { email } = req.body;
  try {
    people = await member.find({ email }).populate({
      path: "project",
      populate: { path: "member", model: "memberList" },
    });
  } catch (err) {
    console.log("Error showing project");
  }
  res.json(people);
};

exports.addMembers = addMembers;
exports.showMembers = showMembers;
exports.showonemember = showonemember;
exports.updateMembers = updateMembers;
exports.removeMembers = removeMembers;
exports.changePassword = changePassword;
exports.MemUpdate = MemUpdate;
exports.memberList = memberList;
exports.getProject = getProject;
exports.login = login;
