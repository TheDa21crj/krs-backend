const HttpError = require("../../models/HttpError");
const user = require("../../models/userSchema");
const event = require("../../models/eventsSchema");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const getUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  let users;
  try {
    users = await user.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
  let events;
  try {
    events = await event.find({ _id: { $in: users.eventid } });
    console.log(events);
  } catch (err) {
    const error = new HttpError("Creating form failed, please try again.", 500);
    return next(error);
  }

  res.json({ users: users, userevents: events });
};

const AddUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, image, roll, branch, year, number } = req.body;
  try {
    let userPrev = await user.findOne({ email });

    if (userPrev) {
      return res.status(202).json("Email already Exists");
    } else {
      // console.log(emailMain, picture, name);
      let userData = new user({
        name,
        email,
        image,
        roll,
        branch,
        year,
        number,
      });

      await userData.save();
      let token;
      try {
        token = jwt.sign(
          {
            userEmail: email,
            designation: "user",
          },
          process.env.JWT_SECRATE,
          { expiresIn: "3hr" }
        );
      } catch (err) {
        const error = new HttpError("Error error generating token", 401);
        console.log(err);
        return next(error);
      }
      return res.status(200).json({
        message: "User Added",
        user: {
          name: name,
          email: email,
          pic: image,
          roll: roll,
          year: year,
          branch: branch,
        },
        token: token,
      });
      // const error = new HttpError("Wrong Email Credentials", 400);
      // return next(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error");
  }
};

const sendEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;
  try {
    console.log(name, email, message);
    mailer(name, email, message);
    res.status(202).json({ message: "Send" });
  } catch (error) {
    console.log(error);
  }
};

const mailer = (name, email, message) => {
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
      to: "kiit.robotics.society.event@gmail.com",
      subject: "Sending Email using Node.js for Password Updation",
      // text: otp
      html: `<div>
      <p>
        Name = ${name}
      <br>
        Email = ${email}
      </p>
      <br>
      Message = ${message}
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

exports.sendEmail = sendEmail;
exports.getUser = getUser;
exports.AddUser = AddUser;
