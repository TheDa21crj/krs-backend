const mongoose = require('mongoose')

const eventsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    mode: { type: String, required: true },
    teamcreation: { type: String, required: true },
    teamsize: { type: Number, default:0 },
    price: { type: Number, default:0 },
    date: { type: Date, default: Date.now },
    formid: [{ type: mongoose.Types.ObjectId, required: true, ref: 'forms' }],
    registrationformid: { type: mongoose.Types.ObjectId,  ref: 'forms'},
    thumbnil: [{ type: String, required: true }],
    reasultlink: { type: String,default:"none" },
    status: { type: String, required: true },
    sheetid: { type: String, required: true },
});

const events = new mongoose.model("events", eventsSchema);

module.exports = events;