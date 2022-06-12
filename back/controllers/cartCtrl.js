const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')

const cartCtrl = {
  createCart:async (req, res) =>{
    try {
      const {cart} = req.body

      const newCart = new cartModel({
        cart,
      }) 


      const carts = await newCart.save()
      res.json(carts)
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },
  getCart:async (req, res)=>{
    try {
        const {_id} = await cartModel.findOne()
 
     res.json({_id})

    const cart = await cartModel.find()
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },


  getIdCart:async (req, res)=>{
    try {
     const cart = await cartModel.findById(req.params.id)

     res.json(cart)
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  addCart: async(req, res)=>{
    try {
    const {cart} = req.body
    const {product} = await productModel.find()

      await cartModel.findByIdAndUpdate(
        req.params.id,
        {$addToSet: {cart}},
        {new: true},
        (err, carte)=>{
          if(err) throw err
          res.status(200).json(carte)
        }
      )
 
 
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

}

module.exports = cartCtrl