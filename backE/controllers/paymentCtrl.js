const payementModel = require('../models/paymentModel')
const userModel = require('../models/userModel')
const produitModel = require('../models/productModel')
const commandModel = require('../models/commandModel')


module.exports = paymentCtrl = {
  getPayments: async(req, res)=>{
    try {
      const payments = await payementModel.find()
      res.json(payments)
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },

  createPayment: async(req, res) =>{
    try {
      const user = await userModel.findById(req.user).select('pseudo email')

      if(!user)  return res.json({msg: "user does not exist"})   

      const {cart, paymentID, items} = req.body
      const {_id, pseudo, email} = user;

      console.log(items);

      const newPayment = new payementModel({
          user_id: _id,
          name: pseudo,
          email, 
          cart, 
          paymentID, 
          items
      })


      cart.filter(item =>{
        return sold(item._id, item.quantity, item.sold)
      })

     const payment = await newPayment.save()

      res.json({msg: payment})

    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  }
}
const sold = async(id, quantity, oldSold) =>{
  await produitModel.findOneAndUpdate({_id: id},{
    sold: quantity + oldSold
  })
} 
