const mongoose = require('mongoose')

const alumniSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,        
    },
    designation:{
        type:String
    },
    image:{
        type:String
    },
    domain:{
        type:String,
        required:true
    },
    social:{
        type:Object
    },
    year:{
        type:Number,
        required:true
    },
    bio:{
        type:String
    },
    branch:{
        type:String
    },
    email: { type: String, required: true }
})

const alumniList = mongoose.model('alumniList',alumniSchema);

module.exports = alumniList;