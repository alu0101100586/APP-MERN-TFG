const mongoose = require("mongoose");
const userRoleEnum = require("../enum/userRole.enum");
const musicGenreEnum = require("../enum/musicGenre.enum");

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
    enum: Object.values(userRoleEnum),
    default: userRoleEnum.COMMON,
    required: true
  },
  avatar: String,
  discs: [{type: String}],
  concerts: [{type: String}],
  merchandise: [{type: String}],
  musicalGenre: [{ 
    type: String, 
    enum: Object.values(musicGenreEnum),
   }],
}, {versionKey: false,
  timestamps: true});

module.exports = mongoose.model("User", UserSchema);