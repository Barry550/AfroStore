const mongoose = require('mongoose')

const SchemaCart = new mongoose.Schema(
  {
    cart:{
      type: Array,
      default: []
    },
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('cart', SchemaCart)

  