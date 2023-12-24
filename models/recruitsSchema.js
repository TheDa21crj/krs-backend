const mongoose = require('mongoose')

const recruitsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    social: {
        type: Object
    },
    year: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const recruitList = new mongoose.model('recruitList', recruitsSchema)

module.exports = recruitList