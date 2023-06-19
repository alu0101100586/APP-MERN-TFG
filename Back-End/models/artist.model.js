const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const musicGenreEnum = require('../enum/musicGenre.enum')

const ArtistSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    musicalGenre: [
      {
        type: String,
        enum: Object.values(musicGenreEnum),
      },
    ],
    avatar: { type: String },
    discs: [{ type: String }],
    concerts: [{ type: String }],
    merchandise: [{ type: String }],
  },
  { versionKey: false, timestamps: true }
)

ArtistSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Artist', ArtistSchema)
