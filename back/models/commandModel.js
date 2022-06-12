const mongoose = require('mongoose')

const SchemaUser = new mongoose.Schema(
  {
    user_id:{
      type: String,
      required: true
    },
  
    items:{
      type: Object,
      require: true
    },
  
    cart:{
      type: Array,
      default: []
    },
  
    status:{
      type: Boolean,
      default: false
    },

  },
  {
    timestamps: true
  }
)


module.exports = mongoose.model('command', SchemaUser)