const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const merchandiseSize = require('../enum/merchandiseSize.enum')

const MerchandiseSchema = mongoose.Schema(
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
    size: [
      {
        type: String,
        enum: Object.values(merchandiseSize),
        required: true,
      },
    ],
    image: { type: String },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
)

MerchandiseSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Merchandise', MerchandiseSchema)
