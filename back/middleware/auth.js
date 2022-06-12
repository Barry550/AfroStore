const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
  try {
    const token = req.header('Authorization')

    if(!token) res.status(500).json({msg: "invalid Authentification"})
    if(token){
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, user)=>{
        if(err) res.status(500).json({msg: "invalid Authentification"})
  
        req.user = user.id
        console.log(req.user);
  
        next()
      })
    }
  } catch (err) { 
    return res.status(400).json({msg: err.message})
    
  }
}

module.exports = auth