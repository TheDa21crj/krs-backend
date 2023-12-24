const express = require("express");
const bodyParser = require("body-parser");
const members = require("./routes/members");
const alumni = require("./routes/alumni");
const recruits = require("./routes/recruits");
const events = require("./routes/events");
const forms = require("./routes/forms");
const login = require("./routes/login");
const user = require("./routes/user");
const registrations = require("./routes/registration");
const achievements = require("./routes/achievements");
const meetings = require("./routes/meetings");
const inventory = require("./routes/inventory");
const project = require("./routes/project");
const mongoose = require("mongoose");
const HttpError = require("./models/HttpError");
const uuid = require("uuid");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,OPTIONS"
  );

  next();
});

app.get("/test", (req, res) => {
  res.send("hello from the world of web");
});

app.use("/api/user", user);
app.use("/api/form", forms);
app.use("/api/login", login);
app.use("/api/events", events);
app.use("/api/members", members);
app.use("/api/recruits", recruits);
app.use("/api/registration", registrations);
app.use("/api/achievements", achievements);
app.use("/api/meetings", meetings);
app.use("/api/inventory", inventory);
app.use("/api/project", project);
app.use((req, res, next) => {
  console.log(req.url);
  const error = new HttpError("Route not found", 404);
  return next(error);
});

mongoose.connect(process.env.DB_URI).then(
  app.listen(port, () => {
    console.log("Listining on port " + port);
    console.log("connected");
  })
);
