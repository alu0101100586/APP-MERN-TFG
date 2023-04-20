const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const NewsletterSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
})

NewsletterSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Newsletter', NewsletterSchema)
