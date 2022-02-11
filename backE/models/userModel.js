const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const SchemaUser = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },

    cart: {
      type: Array,
      default: []
    },

    role: {
      type: Number,
      default: 0
    },

    likes:{
      type: [String],
    },

  },
  {
    timestamps: true
  }
)

SchemaUser.pre('save', async function(next){
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

SchemaUser.statics.login = async function(email, password){
  const user = await this.findOne({email})
  if(user){
    const auth = await bcrypt.compare(password, user.password)
    if(auth){
      return user
    }
    throw Error('Password incorrect')
  }
  throw Error("Email incorrect") 
}

module.exports = mongoose.model('user', SchemaUser)