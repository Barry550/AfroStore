const categoryModel = require('../models/categoryModel')
const productModel = require('../models/productModel')
const ObjectId = require('mongoose').Types.ObjectId

const categoryCtrl = {
  getCategory: async (req, res) =>{
    try {  
      const categories = await categoryModel.find().sort({createdAt: -1})
      if(categories){
        res.json(categories)
      }
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  createCategory: async (req, res) =>{
    try {
      const {name} = req.body
      const category = await categoryModel.findOne({name})
      if(category) return res.json({msg: "cette catégorie existe déjà"})
      const newCategory = new categoryModel({
        name
      })

      await newCategory.save((err, data)=>{
        if(err) throw err

        res.json(data)
      })
  
   
    } catch (err) { 
     return res.status(400).json({msg: err.message})   
    }
  },
    
  deleteCategory: async (req, res) =>{
    try {
      const products = await productModel.findOne({category: req.params.id})
      if(products) return res.status(400).json({msg: "Please delete all products with a relationship"})
      await categoryModel.findByIdAndDelete(req.params.id)
      res.json({msg: "Catégorie supprimé"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },

  updateCategory: async (req, res) =>{
    try {
      const {name} = req.body
      await categoryModel.findOneAndUpdate({_id: req.params.id},
        {
          name
        },
        {new: true},
          (err, data)=>{
          if(err) throw err

          res.json(data)
        })
      // res.json({msg: "Updated category"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  }

  // updateCategory: async (req, res)=>{
  //   try {
      
  //    await categoryModel.findByIdAndUpdate(
  //       req.params.id,
  //       {$set: { name: req.body.name}},
  //       {new: true},
  //       (err, data)=>{
  //         res.json(data)
  //       })
        

  //   // const {name} = req.body
  //   //   await categoryModel.findByIdAndUpdate({_id: req.params.id}, {name})
  //   //   res.json({msg: "Updated category"})
  //   } catch (err) {
  //     return res.status(400).json({msg: err.message})
  //   }
  // },

  // deleteCategory: async(req, res) =>{
  //   try {

  //   await categoryModel.deleteOne({_id:req.params.id}).exec()
  //     res.json({msg: "delete category"})
  //   } catch (err) {
  //     return res.status(400).json({msg: "Please delete all products with a relationship"})
  //   }
  // }
}

module.exports = categoryCtrl