const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ArtistSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true
    },
    musicalGenre: [{ 
      type: String, 
      required: true,
      enum: ['Rock', 
             'Pop', 
             'Metal', 
             'Punk', 
             'Indie', 
             'Electronica', 
             'Hip-Hop', 
             'Rap', 
             'Soul', 
             'Reggae', 
             'Blues', 
             'Jazz', 
             'Country', 
             'Folk', 
             'Latin', 
             'Clasica', 
             'Phonk', 
             'House',
             'Techno',
             'Trance',
             'Drum & Bass',
             'Dubstep',
             'Trap',
             'Funk',
             'Disco',
             'R&B',
             'Ska',
             'Reggaeton',
             'Salsa',
             'Merengue',
             'Bachata',
             'Cumbia',
             'Vallenato',
             'Otros']
     }],
    avatar: { type: String },
    successfulDiscs: { type: Number },
    successfulConcerts: { type: Number },
    successfulMerchandise: { type: Number },
    discs: [{ type: String }],
    concerts: [{ type: String }],
    merchandise: [{ type: String }],
}, {versionKey: false,
    timestamps: true});

ArtistSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Artist', ArtistSchema);