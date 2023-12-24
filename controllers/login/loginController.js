const HttpError = require("../../models/HttpError");
const member = require("../../models/memberSchema");
const user = require("../../models/userSchema");
const otp = require("../../models/otpShema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");

const glogin = async (req, res, next) => {
  const { email } = req.body;
  // emailMain, picture, name;

  var validateEmail;
  var ismember = false;

  try {
    validateEmail = await member.findOne({ email: email });
    if (validateEmail) {
      ismember = true;
    }
  } catch (e) {
    const error = new HttpError("member not found", 500);
    return next(error);
  }

  if (!ismember) {
    try {
      validateEmail = await user.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("User not found", 500);
      return next(error);
    }
  }

  if (validateEmail) {
    try {
      token = jwt.sign(
        {
          userEmail: validateEmail.email,
          designation: ismember ? validateEmail.designation : "user",
        },
        process.env.JWT_SECRATE,
        { expiresIn: "3hr" }
      );
    } catch (err) {
      console.log(err);
      const error = new HttpError("Error logging user", 401);

      return next(error);
    }

    var userinfo = {
      name: validateEmail.name,
      pic: validateEmail.image,
      email: validateEmail.email,
      roll: 0,
      branch: validateEmail.branch,
      year: validateEmail.year,
    };

    if (ismember) {
      console.log("JJJ");
      console.log(userinfo);
      userinfo.roll = 5676757;
    } else {
      userinfo.roll = validateEmail.roll;
    }
    console.log(userinfo);
    return res
      .status(200)
      .json({ success: true, token: token, user: userinfo });
  } else {
    try {
      let validateUser = await user.findOne({ email });
      if (validateUser) {
        console.log("User Exists");
        return res.status(200).json({ message: "USER Exists" });
      }
      console.log(email);
      console.log("New User");
      return res.status(206).json({ message: "NEW USER" });
    } catch (e) {
      const error = new HttpError("user not found", 400);
      return next(error);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  var validateEmail;
  var ismember = false;
  try {
    validateEmail = await member.findOne({ email: email });
    if (validateEmail) {
      ismember = true;
    }
  } catch (e) {
    const error = new HttpError("member not found", 500);
    return next(error);
  }

  if (!ismember) {
    try {
      validateEmail = await user.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("User not found", 500);
      return next(error);
    }
  }

  if (validateEmail) {
    const isMatch = await bcrypt.compare(password, validateEmail.password);
    console.log("saveds :- " + validateEmail.password);
    if (!isMatch) {
      const error = new HttpError("Wrong credentials", 400);
      return next(error);
    } else {
      let token;
      try {
        token = jwt.sign(
          {
            userEmail: validateEmail.email,
            designation: ismember ? validateEmail.designation : "user",
          },
          process.env.JWT_SECRATE,
          { expiresIn: "3hr" }
        );
      } catch (err) {
        const error = new HttpError("Error error generating token", 401);
        console.log(err);
        return next(error);
      }
      var userinfo = {
        name: validateEmail.name,
        pic: validateEmail.image,
        email: validateEmail.email,
        roll: 0,
        branch: validateEmail.branch,
        year: validateEmail.year,
      };
      if (ismember) {
        userinfo.roll = validateEmail.email.split("@")[0];
      } else {
        userinfo.roll = validateEmail.roll;
      }
      res.status(200).json({ success: true, token: token, user: userinfo });
    }
  } else {
    const error = new HttpError("Wrong Email Credentials", 400);
    return next(error);
  }
};

const getLevel = async (req, res, next) => {
  const level = res.locals.userData.userLevel;
  console.log(level);
  console.log("level");
  res.send({ desig: level });
};

const signup = async (req, res, next) => {
  const {
    email,
    name,
    designation,
    // image,
    year,
    branch,
    password,
    number,
    roll,
  } = req.body;

  let users;
  try {
    users = await user.findOne({ email: email });
    console.log(users);
  } catch (e) {
    const error = new HttpError("Wrong Email Credentials", 400);
    return next(error);
  }

  if (users) {
    res.json({ exists: true });
    return;
  } else {
    let image;
    try {
      image = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    } catch (e) {
      const error = new HttpError("gravatar error", 400);
      return next(error);
    }

    const newUser = new user({
      email: email,
      name: name,
      designation: designation,
      year: year,
      image,
      branch: branch,
      password: password,
      roll,
      number,
      eventid: [],
    });
    try {
      // console.log(newEvent)
      const createduser = await newUser.save();
      let token;
      try {
        token = jwt.sign(
          { userEmail: email, designation: "user" },
          process.env.JWT_SECRATE,
          { expiresIn: "3hr" }
        );
      } catch (err) {
        const error = new HttpError("Error logging user", 401);
        console.log(err);
        return next(error);
      }
      var userinfo = {
        name: name,
        pic: createduser.image,
        email: email,
        roll: roll,
        branch: branch,
        year: year,
      };
      res.json({ exists: false, token: token, user: userinfo });
    } catch (err) {
      console.log(err);
      const error = new HttpError("Cannot add user", 400);
      return next(error);
    }
  }
};

const mailer = (email, otp, res) => {
  try {
    var transporter = nodemailer.createTransport({
      // host: 'smtp.gmail',
      // port: 465,
      // secure: true,
      host: "smtp.ethereal.email",
      name: "google.com",
      service: "gmail",
      auth: {
        user: "kiit.robotics.society.event@gmail.com",
        pass: "yloejahwnqyuuqdn",
      },
    });

    var mailOptions = {
      from: "kiit.robotics.society.event@gmail.com",
      to: email,
      subject: "Otp for Password Updation",
      // text: otp
      html: `<div>
                  <h1>Please don't share the otp with anyone.</h1><br />
                  <h2>The otp provided will expire in 5 min</h2>
                  <h3>${otp}</h3>
              </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(304).send();
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send();
      }
    });
  } catch (e) {
    console.log(e);
    const error = new HttpError("Cannot add user", 400);
    return next(error);
  }
};

const checkEmail = async (req, res, next) => {
  let check, precheck;

  try {
    const email = req.params.email;
    precheck = await otp.findOne({ email });
    if (precheck) {
      let currenetTime = new Date().getTime();
      let diff = precheck.expiresIn - currenetTime;
      if (diff > 0) {
        mailer(email, precheck.otp, res);
      }
    } else {
      check = await member.findOne({ email });
      if (!check) {
        check = await user.findOne({ email });
        if (!check) {
          const error = new HttpError(
            "Can't find the required member/user email",
            404
          );

          res.status(400).json({
            message: `Can't find the required member/user email ${email}`,
          });

          return next(error);
        } else {
          let otpcode = Math.floor(Math.random() * 1000000) + 1;
          const otpdata = new otp({
            email,
            otp: otpcode,
            expiresIn: new Date().getTime() + 300 * 1000,
          });
          console.log(otpdata.expiresIn);
          let OTPData = await otpdata.save();
          mailer(email, otpcode, res);
          return;
        }
      } else if (check) {
        let otpcode = Math.floor(Math.random() * 1000000) + 1;
        const otpdata = new otp({
          email,
          otp: otpcode,
          expiresIn: new Date().getTime() + 300 * 1000,
        });
        console.log(otpdata.expiresIn);
        let OTPData = await otpdata.save();
        mailer(email, otpcode, res);
      }
    }
  } catch (err) {
    const error = new HttpError("Error searching email", 404);
    console.log(err);
    return next(error);
  }
  res.status(200).json({ message: "Email found and otp send" });
};

const checkOtp = async (req, res, next) => {
  try {
    let data = await otp.findOne({
      email: req.body.email,
    });

    if (data) {
      if (data.otp === req.body.otp) {
        console.log("\t\tValid");

        await otp.deleteOne({ email: req.body.email });

        return res.status(202).send({ message: "Valid OTP" });
      } else {
        return res.status(302).send({ message: "Invalid OTP" });
      }
    } else {
      return res.status(302).send({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.log(err);
    return res.status(505).send({ message: "Server Error" });
  }
};

const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { password, cpassword, email } = req.body;
  var ismember = false;
  if (password === cpassword) {
    let memberData;
    try {
      memberData = await member.findOne({ email: email });
      console.log(memberData);
      if (memberData !== null) {
        ismember = true;
      } else {
        let userData = await user.findOne({ email: email });
        if (userData !== null) {
          ismember = false;
        }
      }
    } catch (e) {
      console.log(e);
    }

    if (ismember == true) {
      try {
        console.log("member =====" + memberData);
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        console.log("reset :- " + password);

        let UpdatedPassword = await member.findOneAndUpdate(
          { email },
          {
            $set: {
              password,
            },
          }
        );
        return res.status(200).send({
          message: `Password = ${password} and cpassword = ${cpassword}`,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      if (ismember == false) {
        console.log("user =====");
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        console.log("reset :- " + password);
        try {
          let UpdatedPassword = await user.findOneAndUpdate(
            { email },
            {
              $set: {
                password,
              },
            }
          );
        } catch (e) {
          console.log(e);
        }

        return res.status(200).send({
          message: `Password = ${password} and cpassword = ${cpassword}`,
        });
      } else {
        return;
      }
    }
  } else {
    return res
      .status(400)
      .send({ message: "Password and Comform Passwords do not match" });
  }
};

exports.checkEmail = checkEmail;
exports.checkOtp = checkOtp;
exports.resetPassword = resetPassword;
exports.login = login;
exports.glogin = glogin;
exports.signup = signup;
exports.getLevel = getLevel;
