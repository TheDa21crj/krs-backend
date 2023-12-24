const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String
    },
    expiresIn:{
        type:Number
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' },
      },
},{
    timestamps:true
})

const otp = new mongoose.model('otp',otpSchema,'otp')

module.exports = otp;