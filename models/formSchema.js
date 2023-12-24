const mongoose = require('mongoose')

const  formSchema = new mongoose.Schema({
    heading:{
        type:String,
    required:true},
    subtitle:{
        type:String,
    required:true
    },
    instruction:{
        type:String,
    required:true
    },
    type:{
        type:String,
    required:true
    },
    fields:{
        type:Object,        
    },
    thumbnil: { type: String, required: true },
    responseLink:{
        type:String,
        required:true
    },
    eventid: { type: mongoose.Types.ObjectId, required: true, ref: 'events' },
})

const forms = mongoose.model('forms',formSchema )

module.exports = forms;