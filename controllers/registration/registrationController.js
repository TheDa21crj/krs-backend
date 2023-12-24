const HttpError = require("../../models/HttpError");
const forms = require("../../models/formSchema");
const event = require("../../models/eventsSchema");
const user = require("../../models/userSchema");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const Razorpay = require("razorpay");
var crypto = require("crypto");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
var MongoClient = require("mongodb").MongoClient;

const dotenv = require("dotenv");
dotenv.config();

const submition = async (req, res, next) => {
  try {
    if (res.locals.userData.userLevel == "user") {
      const { row, oid, pid, sign, theinfo } = req.body;
      const formId = req.params.fid;
      let form;
      try {
        form = await forms.findById(formId);
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not update form.",
          500
        );
        return next(error);
      }

      let events;

      try {
        events = await event.findById(form.eventid);
      } catch (err) {
        console.log(err);
        const error = new HttpError(
          "Creating form failed, please try again.",
          500
        );
        return next(error);
      }
      const TheEmail = row.filter((e) => {
        if (e.autofill == "email") {
          return e.value;
        }
      });

      if (
        events.status == "Registrations Open" &&
        form.type == "Registration" &&
        events.price > 0
      ) {
        let body = oid + "|" + pid;
        var expectedSignature = crypto
          .createHmac("sha256", process.env.RZPY_SECRET)
          .update(body.toString())
          .digest("hex");
        console.log("sig received ", sign);
        console.log("sig generated ", expectedSignature);
        if (expectedSignature != sign) {
          const error = new HttpError("Payment signature not valid", 500);
          return next(error);
        }
      }

      var currentFields = JSON.parse(form.fields);

      var rowdata = {};

      let fieldfilter = [
        "uuid",
        "teamcode",
        "teamleader",
        "verification",
        "formID",
      ];

      currentFields = currentFields.filter((e) => {
        return !fieldfilter.includes(e.name);
      });

      var k = 0;
      for (var j = 0; j < currentFields.length; j++) {
        if (currentFields[j].type !== "deleted") {
          rowdata = { ...rowdata, [row[k].name]: row[k].value };
          k++;
        }
      }
      rowdata["uuid"] = uuid.v4();
      rowdata["teamcode"] = "";
      rowdata["teamleader"] = "";
      rowdata["formId"] = formId;
      if (events.mode == "Offline") {
        rowdata["verification"] = "Not Verified";
      }

      try {
        const client = new MongoClient(process.env.DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        client.connect((err) => {
          if (err) {
            throw err;
          } else {
            const collection = client
              .db(process.env.SHEET_BUG)
              .collection(events.title);
            collection
              .find({ formId: formId, [TheEmail[0].name]: theinfo.email })
              .toArray(function (err, result) {
                if (err) throw err;

                try {
                  if (result.length === 0) {
                  } else {
                    client.close();
                    setTimeout(() => {
                      client.close();
                    }, 1500);
                    return res.json({ reg: true });
                  }
                } catch (error) {
                  client.close();
                  console.log(error);
                }
              });
          }
        });

        const client2 = new MongoClient(process.env.DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        client2.connect((err) => {
          if (err) {
            throw err;
          } else {
            const collection = client2
              .db(process.env.SHEET_BUG)
              .collection(events.title);
            collection.insertOne(rowdata, function (err, res) {
              if (err) throw err;
              client2.close();
              console.log("1 document inserted");
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
      let users;
      try {
        users = await user.findOne({ email: theinfo.email });
        users.eventid.push(events);
        await users.save();
        const info = {
          price: events.price,
          name: events.title,
          teamcreation: events.teamcreation,
          teamsize: events.teamsize,
        };
        mailer(theinfo.email, theinfo.name, theinfo.roll, pid, info);

        return res.json({ success: true });
      } catch (err) {
        console.log("hha yahi tha error=", err);
        const error = new HttpError("submitions failed please try again.", 500);
        return next(error);
      }
    } else {
      console.log("checking here");
      console.log(res.locals.userData.userLevel);
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    console.log(e);
  }
  // const client = new MongoClient(process.env.DB_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  // client.connect((err) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     const collection = client
  //     .db(process.env.SHEET_BUG)
  //     .collection(events.title);
  //   }})
};

const mailer = (email, name, roll, id, info) => {
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
      subject: "Registration Confirmation",
      // text: otp
      html: `<div>

      ${info.price > 0 ? `Payment ID :${id} ` : ""} 

Hello <strong>${name}</strong>,
<br/><br/>
Warm Greetings from KIIT Robotics Society!
<br/><br/>

Kudos on applying online for our society's non-tech recruitment. We highly appreciate your interest.
Our panel will soon let you know if you have been shortlisted for the Interview round. 
KRS shall be in touch with you shortly.<br/>

<br/>

Incase of any queries feel free to contact us on our dicord server :<br/>
https://discord.gg/YZkVXgNh <br/>
or,<br/>
+91 77260 21453 (Rohit) or +91 98753 63174 (Ritam).<br/>
Until then, follow us on our other social media platforms to stay updated.
<br/>
Regards,<br/>
KIIT Robotics Society
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
    const error = new HttpError("nodemailer err", 500);
    return next(error);
  }
};

const checkReg = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    console.log("checking reg");
    const {
      email,
      // sheetid,
      formid,
    } = req.body;

    let form;
    try {
      form = await forms.findById(formid);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find form.",
        500
      );
      return next(error);
    }

    let eventData = await event.findById(form.eventid);
    let formData = await forms.findById(formid);

    var myobj = JSON.parse(formData.fields);
    const ema = myobj.filter((e) => {
      if (e.autofill == "email") {
        return e;
      }
    });

    var emailVar = ema[0].name;

    const client = new MongoClient(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) {
        throw err;
      } else {
        const collection = client
          .db(process.env.SHEET_BUG)
          .collection(eventData.title);
        collection
          .find({ formId: formid, [emailVar]: email })
          .toArray(function (err, result) {
            if (err) throw err;

            if (result.length === 0) {
              client.close();
              return res.json({ reg: false });
            } else {
              let qr = result[0].uuid.split("-")[0];

              client.close();

              return res.json({ reg: true, code: qr });
            }
          });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const Regcounter = async (req, res, next) => {
  const {
    //  sheetid,
    formid,
  } = req.body;
  try {
    let form;
    try {
      form = await forms.findById(formid);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find form.",
        500
      );
      return next(error);
    }

    let eventData = await event.findById(form.eventid);
    const client = new MongoClient(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) {
        throw err;
      } else {
        const collection = client
          .db(process.env.SHEET_BUG)
          .collection(eventData.title);
        collection.find({ formId: formid }).toArray(function (err, result) {
          if (err) throw err;
          console.log(result.length);
          client.close();
          return res.json({ count: result.length });
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const createteam = async (req, res, next) => {
  try {
    if (res.locals.userData.userLevel == "user") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        email,

        formid,
      } = req.body;
      let form;
      try {
        form = await forms.findById(formid);

        if (form) {
          let eventData = await event.findById(form.eventid);

          var myobj = JSON.parse(form.fields);

          var emailVar = myobj[3].name;
          const client = new MongoClient(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          client.connect((err) => {
            if (err) {
              throw err;
            } else {
              const collection = client
                .db(process.env.SHEET_BUG)
                .collection(eventData.title);

              collection
                .find({ formId: formid, [emailVar]: email })
                .toArray(function (err, result) {
                  if (err) throw err;

                  if (result.length === 0) {
                    return res.json({ message: "DO NO CREATE TEAM" });
                  } else {
                    const gencode = uuid.v4();
                    const code = gencode.split("-")[0];

                    if (result[0].teamcode === "") {
                      collection.updateOne(
                        { formId: formid, [emailVar]: email },
                        { $set: { teamcode: code, teamleader: true } },
                        function (err, res) {
                          if (err) throw err;
                          console.log("1 document updated");
                          client.close();
                        }
                      );
                      return res.json({ success: true });
                    } else {
                      client.close();
                      return res.json({ message: "Team Exsists" });
                    }
                  }
                });
            }
          });
        }
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not find form.",
          500
        );
        return next(error);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const teamstatus = async (req, res, next) => {
  try {
    if (res.locals.userData.userLevel == "user") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        email,
        // sheetid,
        formid,
      } = req.body;
      let form;
      try {
        form = await forms.findById(formid);
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not find form.",
          500
        );
        return next(error);
      }

      let eventData = await event.findById(form.eventid);
      var myobj = JSON.parse(form.fields);
      var emailVar = myobj[3].name;
      var domain = "";

      const client = new MongoClient(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client.connect((err) => {
        if (err) {
          throw err;
        } else {
          const collection = client
            .db(process.env.SHEET_BUG)
            .collection(eventData.title);

          collection
            .find({ formId: formid, [emailVar]: email })
            .toArray(function (err, result) {
              if (err) throw err;

              if (result.length > 0 && result[0].teamcode !== "") {
                collection
                  .find({ formId: formid, teamcode: result[0].teamcode })
                  .toArray(function (err, resultInner) {
                    if (err) throw err;

                    let teamembers = [];

                    for (var j = 0; j < resultInner.length; j++) {
                      const mem = {
                        name: resultInner[j][myobj[1].name],
                        roll: resultInner[j][myobj[2].name],
                        leader: resultInner[j].teamleader,
                      };
                      teamembers.push(mem);
                    }

                    const teaminfo = {
                      code: resultInner[0].teamcode,
                      members: teamembers,
                      num: teamembers.length,
                    };

                    console.table(teaminfo);
                    client.close();

                    return res.json({
                      exist: true,
                      teaminfo: teaminfo,
                      verification: "status",
                      domain: domain,
                    });
                  });
              } else {
                client.close();
                return res.json({
                  exist: false,
                  verification: "status",
                  domain: domain,
                });
              }
            });
        }
      });
    } else {
      console.log(e);
      const error = new HttpError("Access Denied", 500);
      return next(error);
    }
  } catch (e) {
    console.log(e);
  }
};

const newLeader = async (title, formid, code, emailVar) => {
  try {
    console.log("New Leader");
    const client = new MongoClient(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) {
        throw err;
      } else {
        const collection = client.db(process.env.SHEET_BUG).collection(title);
        collection
          .find({ formId: formid, teamcode: code })
          .toArray(function (err, result) {
            if (err) throw err;

            collection.updateOne(
              { _id: result[0]._id },
              { $set: { teamleader: true } },
              function (err, res) {
                if (err) throw err;
                console.log(result[0][emailVar]);
                client.close();
                console.log("1 document updated New Leader");
              }
            );
            console.log(result[0].teamleader);
          });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const leaveteam = async (req, res, next) => {
  try {
    if (res.locals.userData.userLevel == "user") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, code, formid } = req.body;
      let form;
      try {
        form = await forms.findById(formid);
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not find form.",
          500
        );
        return next(error);
      }

      let events = await event.findById(form.eventid);
      var myobj = JSON.parse(form.fields);
      var emailVar = myobj[3].name;

      const client = new MongoClient(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client.connect((err) => {
        if (err) {
          throw err;
        } else {
          const collection = client
            .db(process.env.SHEET_BUG)
            .collection(events.title);

          collection
            .find({ formId: formid, teamcode: code, [emailVar]: email })
            .toArray(function (err, result) {
              if (err) throw err;

              console.log("result=====");
              console.log(result);

              if (result.length === 1) {
                collection.updateOne(
                  { formId: formid, [emailVar]: email },
                  { $set: { teamcode: "", teamleader: "" } },
                  function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    client.close();
                  }
                );

                return res.json({ success: true });
              }

              if (result.length > 0) {
                if (result[0].teamleader === "") {
                  collection.updateOne(
                    { formId: formid, [emailVar]: email },
                    { $set: { teamcode: "" } },
                    function (err, res) {
                      if (err) throw err;
                      console.log("1 document updated");
                      client.close();
                    }
                  );

                  return res.json({ success: true });
                } else {
                  collection.updateOne(
                    { [emailVar]: email },
                    { $set: { teamleader: "", teamcode: "" } },
                    function (err, res) {
                      if (err) throw err;
                      console.log(email);
                      client.close();
                      console.log("1 document updated OLD Leader");
                    }
                  );

                  newLeader(events.title, formid, code, emailVar);

                  return res.status(202).json({ success: true });
                }
              } else {
                client.close();
                return res.status(202).json({ success: false });
              }
            });
        }
      });
    } else {
      console.log(e);
      const error = new HttpError("Access Denied", 500);
      return next(error);
    }
  } catch (e) {
    console.log(e);
  }
};

const jointeam = async (req, res, next) => {
  try {
    if (res.locals.userData.userLevel == "user") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, code, formid } = req.body;
      let form;
      try {
        form = await forms.findById(formid);
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not find form.",
          500
        );
        return next(error);
      }
      let events;

      try {
        events = await event.findById(form.eventid);
      } catch (err) {
        const error = new HttpError(
          "Creating form failed, please try again.",
          500
        );
        return next(error);
      }

      try {
        var myobj = JSON.parse(form.fields);
        var emailVar = myobj[3].name;

        const client = new MongoClient(process.env.DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        client.connect((err) => {
          if (err) {
            throw err;
          } else {
            const collection = client
              .db(process.env.SHEET_BUG)
              .collection(events.title);

            collection
              .find({ formId: formid, teamcode: code })
              .toArray(function (err, result) {
                if (err) {
                  console.log("not found code");
                  throw err;
                }

                let number = result.length;

                if (number >= events.teamsize) {
                  client.close();
                  return res.json({ success: false, msg: "Team Full" });
                } else if (number !== 0) {
                  console.log(result);

                  collection.updateOne(
                    { formId: formid, [emailVar]: email },
                    { $set: { teamcode: code } },
                    function (err, res) {
                      if (err) throw err;
                      console.log("1 document updated");
                      client.close();
                    }
                  );

                  return res.json({ success: true, msg: "" });
                } else {
                  client.close();
                  return res.json({ success: false, msg: "Invalid Code" });
                }
              });
          }
        });
      } catch (e) {
        console.log(e);
        const error = new HttpError(
          "Creating form failed, please try again.",
          500
        );
        return next(error);
      }
    } else {
      console.log(e);
      const error = new HttpError("Access Denied", 500);
      return next(error);
    }
  } catch (e) {
    console.log(e);
  }
};

const qrcheck = async (req, res, next) => {
  const { email, code, sheetid, heading } = req.body;

  try {
    const doc = new GoogleSpreadsheet(sheetid);
    doc.useServiceAccountAuth({
      client_email: process.env.SHEET_ID,
      private_key: process.env.SHEET_KEY.replace(
        new RegExp("\\\\n", "g"),
        "\n"
      ),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[heading];
    const rows = await sheet.getRows();
    let userindex;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].email == email) {
        userindex = i;
        break;
      }
    }

    const qr = rows[userindex].uid.split("-")[0];
    if (qr == code) {
      return res.json(true);
    } else {
      const error = new HttpError("User exists", 500);
      return next(error);
    }
  } catch (e) {
    console.log(e);
    const error = new HttpError("User exists", 500);
    return next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    if (
      res.locals.userData.userLevel == "admin" ||
      res.locals.userData.userLevel == "oc"
    ) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        code,
        // sheetid,
        formid,
        type,
      } = req.body;

      let form;

      try {
        form = await forms.findById(formid);
      } catch (e) {
        console.log(e);
        const error = new HttpError("User exists", 500);
        return next(error);
      }

      let events;
      try {
        events = await event.findById(form.eventid);
      } catch (e) {
        const error = new HttpError(
          "Something went wrong, could not find form.",
          500
        );
        return next(error);
      }

      var myobj = JSON.parse(form.fields);
      var emailVar = myobj[3].name;

      try {
        MongoClient.connect(process.env.DB_URI, function async(err, db) {
          if (err) throw err;
          var dbo = db.db(process.env.SHEET_BUG);

          dbo
            .collection(events.title)
            .find({ formId: formid })
            .toArray(function (err, result) {
              if (err) throw err;
              for (var i = 0; i < result.length; i++) {
                console.log(result[i].uuid.split("-")[0], code);
                if (result[i].uuid.split("-")[0] === code) {
                  var info = {
                    name: result[i][myobj[1].name],
                    roll: result[i][myobj[2].name],
                    verification: result[i].verification,
                    email: result[i][myobj[3].name],
                    slot: "",
                  };

                  if (type == "verify") {
                    info.verification = "Verified";

                    dbo
                      .collection(events.title)
                      .updateOne(
                        { formId: formid, [emailVar]: info.email },
                        { $set: { verification: "Verified" } },
                        function (err, res) {
                          if (err) throw err;
                          console.log("1 document updated");
                          // db.close();
                        }
                      );

                    console.table(info);
                    // return;
                    return res.json({ success: true, info: info });
                  } else if (type == "detect") {
                    console.log("detect");
                    // return;
                    return res.json({ success: true, info: info });
                  }
                } else {
                  console.log("pass");
                }
              }
            });
        });
      } catch (e) {
        const error = new HttpError(
          "Something went wrong, could not find form.",
          500
        );
        return next(error);
      }

      // return res.json({ success: true });
    } else {
      console.log(e);
      const error = new HttpError("Access Denied", 500);
      return next(error);
    }
  } catch (e) {
    console.log(e);
  }
};

const createOrder = async (req, res, next) => {
  const { price } = req.body;
  console.log(process.env.RZPY_ID);
  var instance = new Razorpay({
    key_id: process.env.RZPY_ID,
    key_secret: process.env.RZPY_SECRET,
  });
  var options = {
    amount: price * 100, // amount in the smallest currency unit
    currency: "INR",
  };
  try {
    instance.orders.create(options, function (err, order) {
      console.log(order);
      res.send({ orderId: order.id });
    });
  } catch (e) {
    console.log(e);
    const error = new HttpError("User exists", 500);
    return next(error);
  }
};

exports.submition = submition;
exports.createOrder = createOrder;
exports.qrcheck = qrcheck;
exports.createteam = createteam;
exports.teamstatus = teamstatus;
exports.leaveteam = leaveteam;
exports.jointeam = jointeam;
exports.verify = verify;
exports.checkReg = checkReg;
exports.Regcounter = Regcounter;
