const commandModel = require('../models/commandModel')
const userModel = require('../models/userModel')

const commandCtrl = {
  getCommand: async(req, res)=>{
    try {
      const command = await commandModel.find()
      res.json(command)
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },

  postCommand: async(req, res) =>{
    try {
      const user = await userModel.findById(req.user).select('pseudo email')

      if(!user)  return res.json({msg: "user does not exist"})   

      const {cart, items} = req.body
      const {_id, pseudo, email} = user;

      console.log(items);

      const newCommand = new commandModel({
          user_id: _id,
          cart, 
          items 
      })


     const command = await newCommand.save()

      res.json({msg: command})

    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },

  deleteCommand: (req, res) =>{

    try {
      return commandModel.findByIdAndUpdate(
        req.params.id,
        {$pull: {cart: {_id: req.body.commentId}}},
        {new: true},
        (err, docs)=>{
          if(!err) return res.send(docs)
            else return res.status(400).send(err)
        }
      )
    } catch (err) {
        return res.status(400).send(err);
    }
  },

  deleteCommandAll: async (req, res) =>{
    try {
    await  commandModel.remove({_id: req.params.id}).exec()

      res.json("delete")
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },
}


module.exports = commandCtrl