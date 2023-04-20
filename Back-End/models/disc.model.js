const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const musicGenreEnum = require('../enum/musicGenre.enum')

const DiscSchema = mongoose.Schema(
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
    releaseDate: {
      type: Date,
      required: true,
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
    cover: { type: String },
    songs: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { versionKey: false, timestamps: true }
)

DiscSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Disc', DiscSchema)
