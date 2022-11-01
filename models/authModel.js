const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
      trim : true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      trim : true,
    },
    contactNo: {
        type : Number,
        required : [true, 'Please provide contact no'],
        trim : true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      trim : true,
    },
  })


module.exports = mongoose.model('User', UserSchema)