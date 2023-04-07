const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  nickName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    enum: ["artist", "common"],
    default: "common",
    required: true
  },
  discs: [{type: String}],
  concerts: [{type: String}],
  merchandise: [{type: String}]
}, {versionKey: false,
  timestamps: true});

module.exports = mongoose.model("User", UserSchema);