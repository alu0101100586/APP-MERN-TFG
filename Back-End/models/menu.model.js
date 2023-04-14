const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
    unique: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Menu', MenuSchema);