const userModel = require('../models/userModel')

const authAdmin = async (req, res, next)=>{
  try {
    const user = await userModel.findById(req.user)

    console.log("Userman: ", user.role)
    if(user.role !== 1){
      res.status(500).json({msg: "Admin ressource access denied"})
    }

  next()
  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
}

module.exports = authAdmin