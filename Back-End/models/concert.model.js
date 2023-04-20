const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const musicGenreEnum = require('../enum/musicGenre.enum')

const ConcertSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    moneyLimit: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    raisedMoney: {
      type: Number,
      default: 0,
      required: true,
    },
    musicalGenre: [
      {
        type: String,
        enum: Object.values(musicGenreEnum),
        required: true,
      },
    ],
    concertPoster: { type: String },
    participants: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { versionKey: false, timestamps: true }
)

ConcertSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Concert', ConcertSchema)
