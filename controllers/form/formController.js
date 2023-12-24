const HttpError = require("../../models/HttpError");
const forms = require("../../models/formSchema");
const eventm = require("../../models/eventsSchema");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

const createForms = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { heading, subtitle, instruction, fields, typeofform, eventid } =
      req.body;

    const fieldnames = [];
    if (res.locals.userData.userLevel == "admin") {
      let events;
      let header;
      try {
        events = await eventm.findById(eventid);
        console.log(events);
      } catch (err) {
        const error = new HttpError(
          "Creating form failed, please try again.",
          500
        );
        return next(error);
      }

      const thumbnil = events.thumbnil[0];
      const sheetid = events.sheetid;
      fields.unshift({ name: "uuid", type: "text", value: "" });
      fields.push({ name: "teamcode", type: "text", value: "" });
      fields.push({ name: "teamleader", type: "text", value: false });
      if (events.mode == "Offline") {
        fields.push({
          name: "verification",
          type: "text",
          value: "not verified",
        });
      }

      for (var i = 0; i < fields.length; i++) {
        fieldnames.push(fields[i].name);
      }

      // try {
      //   const doc = new GoogleSpreadsheet(sheetid); //"1d_VfB36G-Ep4gwU_MyISTjz4nS6npbsAvrXHDC3gYMA"
      //   doc.useServiceAccountAuth({
      //     client_email: process.env.SHEET_ID,
      //     private_key: process.env.SHEET_KEY.replace(
      //       new RegExp("\\\\n", "g"),
      //       "\n"
      //     ),
      //   });
      //   header = await doc.addSheet({
      //     title: heading,
      //     headerValues: fieldnames,
      //   });
      // } catch (err) {
      //   console.log(err);
      //   const error = new HttpError(
      //     "Fetching event failed, please try again later.",
      //     500
      //   );
      // }

      const form = new forms({
        heading: heading,
        subtitle: subtitle,
        instruction: instruction,
        type: typeofform,
        fields: JSON.stringify(fields),
        thumbnil: thumbnil,
        // responseLink: "https://docs.google.com/spreadsheets/d/" + sheetid + "/",
        responseLink: "null",
        eventid: eventid,
      });

      try {
        console.log(typeofform);
        const sess1 = await mongoose.startSession();

        sess1.startTransaction();

        await form.save({ session: sess1 });
        if (typeofform === "Normal") {
          events.formid.push(form);
        } else {
          events.registrationformid = form;
        }
        await events.save({ session: sess1 });
        await sess1.commitTransaction();

        sess1.endSession();
      } catch (err) {
        console.log(e);
        const error = new HttpError(
          "somthing went wrong in creating forms",
          500
        );
        return next(error);
      }
      let fieldfilter = ["uuid", "teamcode", "teamleader", "verification"];
      form.fields = JSON.parse(form.fields);
      const currfields = form.fields.filter((e) => {
        return !fieldfilter.includes(e.name);
      });
      form.fields = currfields;
      res.status(200).json({ form: form.toObject({ getters: true }) });
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(e);
  }
};

const getFormsById = async (req, res, next) => {
  let form;
  try {
    form = await forms.findById(req.params.id);
    console.log(form);
  } catch (err) {
    res.json({ form: false });
    const error = new HttpError(
      "Something went wrong, could not find form.",
      500
    );
    return next(error);
  }
  if (!form) {
    const error = new HttpError(
      "Could not find form for the provided id.",
      404
    );

    return next(error);
  }
  let events;
  try {
    events = await eventm.findById(form.eventid);
  } catch (err) {
    const error = new HttpError("Creating form failed, please try again.", 500);
    return next(error);
  }
  const eventinfo = {
    title: events.title,
    venue: events.venue,
    price: events.price,
    sheetid: events.sheetid,
    pic: events.thumbnil[0],
    status: events.status,
    date: events.date,
  };
  console.log(eventinfo);
  let fieldfilter = ["uuid", "teamcode", "teamleader", "verification"];
  form.fields = JSON.parse(form.fields);
  const currfields = form.fields.filter((e) => {
    return !fieldfilter.includes(e.name);
  });
  form.fields = currfields;
  res
    .status(200)
    .json({ form: form.toObject({ getters: true }), event: eventinfo });
};

const getForms = async (req, res, next) => {
  let form;
  try {
    form = await forms.find({}).lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find form.",
      500
    );
    return next(error);
  }

  if (!form) {
    const error = new HttpError(
      "Could not find form for the provided id.",
      404
    );
    return next(error);
  }

  let fieldfilter = ["uuid", "teamcode", "teamleader", "verification"];
  for (var i = 0; i < form.length; i++) {
    form[i].fields = JSON.parse(form[i].fields);
    const currfields = form[i].fields.filter((e) => {
      return !fieldfilter.includes(e.name);
    });
    form[i].fields = currfields;
  }
  res.json({ forms: form });
};

const deleteForms = async (req, res, next) => {
  let form;
  try {
    const formId = req.params.fid;
    form = await forms.findById(formId);
  } catch (err) {
    const error = new HttpError("Error finding form id ", 404);
    return next(error);
  }

  let events;
  try {
    events = await eventm.findById(form.eventid);
  } catch (err) {
    const error = new HttpError("Creating form failed, please try again.", 500);
    return next(error);
  }

  // try {
  //   const doc = new GoogleSpreadsheet(events.sheetid); //"1d_VfB36G-Ep4gwU_MyISTjz4nS6npbsAvrXHDC3gYMA"
  //   doc.useServiceAccountAuth({
  //     client_email: process.env.SHEET_ID,
  //     private_key: process.env.SHEET_KEY.replace(
  //       new RegExp("\\\\n", "g"),
  //       "\n"
  //     ),
  //   });
  //   await doc.loadInfo();

  //   let sheet = doc.sheetsByTitle[form.heading];

  //   await sheet.delete();
  // } catch (e) {
  //   console.log(e);
  //   const error = new HttpError(
  //     "Something went wrong, with sheets could not remove form.",
  //     500
  //   );
  //   return next(error);
  // }

  try {
    const sess2 = await mongoose.startSession();
    sess2.startTransaction();
    await form.remove({ session: sess2 });

    if (form.type == "Normal") {
      var filteredArray = events.formid.filter((e) => {
        return e.toString() !== form.id;
      });
      events.formid = filteredArray;
    } else {
      console.log("lk");
      events.registrationformid = undefined;
    }
    console.log(events);
    await events.save({ session: sess2 });
    console.log("done");
    await sess2.commitTransaction();
    sess2.endSession();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove form.",
      500
    );
    console.log(err + "22");
    return next(error);
  }
};

const editForm = async (req, res, next) => {
  const formId = req.params.fid;
  if (res.locals.userData.userLevel == "admin") {
    let getForms;
    try {
      getForms = await forms.findById(formId);
    } catch (err) {
      const error = new HttpError("Error finding Event id ", 404);
      return next(error);
    }
    const { subtitle, instruction, heading } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (getForms) {
      let events;
      try {
        events = await eventm.findById(getForms.eventid);
      } catch (err) {
        const error = new HttpError(
          "Creating form failed, please try again.",
          500
        );
        return next(error);
      }

      // if (getForms.heading != heading) {
      //   try {
      //     const doc = new GoogleSpreadsheet(events.sheetid); //"1d_VfB36G-Ep4gwU_MyISTjz4nS6npbsAvrXHDC3gYMA"
      //     doc.useServiceAccountAuth({
      //       client_email: process.env.SHEET_ID,
      //       private_key: process.env.SHEET_KEY.replace(
      //         new RegExp("\\\\n", "g"),
      //         "\n"
      //       ),
      //     });
      //     await doc.loadInfo();

      //     let sheet = doc.sheetsByTitle[getForms.heading];
      //     sheet.updateProperties({ title: heading });
      //     getForms.heading = heading;
      //   } catch (e) {
      //     const error = new HttpError(
      //       "Something went wrong, with sheets could not remove form.",
      //       500
      //     );
      //     return next(error);
      //   }
      // }

      try {
        getForms.subtitle = subtitle;
        getForms.instruction = instruction;
        await getForms.save();
      } catch (err) {
        const error = new HttpError("Error saving the updated event", 401);
        return next(error);
      }
    } else {
      const error = new HttpError("Event with this id not found", 404);
      return next(error);
    }
  } else {
    const error = new HttpError("Access denied", 400);
    return next(error);
  }
};

exports.createForms = createForms;
exports.getForms = getForms;
exports.getFormsById = getFormsById;
exports.editForms = editForm;
exports.deleteForms = deleteForms;
