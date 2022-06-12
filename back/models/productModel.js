const mongoose = require('mongoose')

const SchemaProduct = new mongoose.Schema(
  {

    ref:{
      type: String,
      unique: true
    },

    title: {
      type: String,
    },
  
    avatar: {
      type: [String],
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true
    },

    images:{
      type: Object,
      required: true,
    },

    sold: {
      type: Number,
      default: 0
    }, 

    price: {
      type: Number,
      required: true
    },

    category:{
      type: String,
      required: true,
    }, 

    likers:{
      type: [String],
      required: true
    }, 

    comments:{
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        }
      ],
      required: true,  
    },
    
    checked:{
        type: Boolean,
        default:false
      },
    },
    
  {
    timestamps: true
  }
)

module.exports = mongoose.model('produc', SchemaProduct)

  