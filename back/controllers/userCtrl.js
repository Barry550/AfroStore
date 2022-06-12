const userModel = require('../models/userModel')
const paymentModel = require('../models/paymentModel')
const commandModel = require('../models/commandModel')
const jwt = require('jsonwebtoken')
const { signUpErrors, signInErrors } = require('../utils/errorsUtils')
const { response } = require('express')

const maxAge = 3 * 24 * 60 * 60 * 1000
const createAccessToken = (id) =>{
  return jwt.sign({id}, process.env.ACCESS_TOKEN, {expiresIn: '1d'})
}

const createRefreshToken = (id) =>{
  return jwt.sign({id}, process.env.REFRESH_TOKEN, {expiresIn: '7d'})
}
const userCtrl = {


  getUsers: async (req, res) =>{
    try {
 
      const users = await userModel.find().select('-password')
      if(users){
        res.json({users})
      }
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  register: async (req, res)=>{
    try {
    const {pseudo, email, password} = req.body
      
    const user = await userModel.create({pseudo, email, password})
      const accesstoken = await createAccessToken(user._id)
      const refreshToken = await createRefreshToken(user._id)

     await res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      })
      res.json({accesstoken})
    } catch (err) {
      const errors = signUpErrors(err)
      return res.status(400).json({msg: errors})
    }
  },

  login: async(req, res)=>{
    try {
      const {email, password} = req.body
      const user = await userModel.login(email, password)
      const accessToken = await createAccessToken(user._id)
      const refreshToken = await createRefreshToken(user._id)

     await res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      })

      res.json({accessToken, user})
    } catch (err) {
      const errors = signInErrors(err)
      return res.status(400).json({msg: errors})
    }
  },

  refreshtoken: async(req, res) =>{
    try {
      const rf_token = req.cookies.refreshtoken

      if(!rf_token) return res.json({msg: 'veuillez vous connecter ou vous enregister'})
        jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, decodedToken)=>{
          if(err)  return res.json({msg: 'veuillez vous connecter ou vous enregister'})

          const accessToken = createAccessToken(decodedToken.id)
          res.status(200).json({accessToken})
      
        })
 
    } catch (err) {  
      return res.status(500).json({msg: err.message})
    }
  },

  logout: (req, res) =>{
    try {
      res.clearCookie('refreshtoken', {path: "/user/refresh_token"})
      return res.json({msg: "logged out"})
    } catch (err) {
      return res.status(400).json({msg: err.message})
      
    }
  },

  addCart: async(req, res) =>{
    const user = await userModel.findById(req.user)
    try {
      if(!user) return res.status(400).json({msg: "L'utilisateur n'existe pas"})

    await userModel.findByIdAndUpdate(
      {_id: req.user}, 
      {cart: req.body.cart})

      res.json({msg: "Ajouté au panier"})
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }

  },

  history: async(req, res) =>{
    try {
      const history = await paymentModel.find({user_id: req.user})
    res.json(history)
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },

  listes: async(req, res) =>{
    try {
      const listes = await commandModel.find({user_id: req.user})
    res.json(listes)
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },

  getUser: async (req, res)=>{
    try {
      const user = await userModel.findById(req.user).select('-password')
      console.log("getUser: ",user);
     
      if(user){
        res.json(user)
      }
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  getUserId: async (req, res)=>{
    try {
      const user = await userModel.findById(req.params.id).select('-password')
      if(user){
        res.json(user)
      }
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  }
}

module.exports = userCtrl