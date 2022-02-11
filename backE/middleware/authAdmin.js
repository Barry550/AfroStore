const userModel = require('../models/userModel')

const authAdmin = async (req, res, next)=>{
  try {
    const user = await userModel.findById(req.user)
    if(user.role === 0){
      res.status(500).json({msg: "Admin ressource access denied"})
    }

  next()
  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
}

module.exports = authAdmin