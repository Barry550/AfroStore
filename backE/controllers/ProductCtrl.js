const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId

class APIfeatures{
  constructor(query, queryString){
    this.query = query,
    this.queryString = queryString
  }

  filtering(){
    const reqQuery = {...this.queryString}

    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    removeFields.forEach(param => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|regex)\b/g, match => `$${match}`);

    this.query.find(JSON.parse(queryStr))
    return this
  }

  selecting(){
    if (this.queryString.select) {
      const fields = this.queryString.select.split(',').join(' ');
      this.query.select(fields);
    }

    return this
  }

  sorting(){
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
  } else {
      this.query.sort('-createdAt');
  }
    return this
  }

  pagination(){
    const page = this.queryString * 1 || 1
    const limit = this.queryString * 1 || 50
    const skip = (page - 1) * limit
    this.query.skip(skip).limit(limit)
    return this
  }
}

const productCtrl = {
  getProducts: async (req, res) =>{
    try {
      const features = await new APIfeatures(productModel.find(), req.query).filtering().selecting().sorting().pagination()
      const products = await features.query

      res.json({result: {
        status: "success",
        result: products.length,
        products: products
      }})
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }   
  },

  getOneProduct: async(req, res) =>{
    try {
  const product = await productModel.findById(req.params.id)

  res.json({product})
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  createProduct:async (req, res) =>{
    try {

      const {title,ref, description, content,images, sold, price, category, checked} = req.body

     if(!images) return res.json({msg: "Aucun téléchargement d'image"})
      const produc = await productModel.findOne({ref})
      if(produc) 
          return res.json({msg: "ce produit existe déjà"})

      const newProduct = new productModel({
        ref,
        title,
        description,
        content,
        images,
        category,
        price,
      }) 

      const product = await newProduct.save()
      res.json({product})
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  updateProduct:async (req, res) =>{
    try {
 

       await productModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title, 
            description: req.body.description, 
            content: req.body.content, 
            images: req.body.images,
            price: req.body.price, 
            category: req.body.category
          },
        },
        {new: true},
        (err, data)=>{

          if(err) throw err
          res.json({product: data})
        }
      )

    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  deleteProduct: async (req, res) =>{
    try {
    await  productModel.remove({_id: req.params.id}).exec()

      res.json("delete")
    } catch (err) {
      return res.status(400).json({msg: err.message})
    }
  },

  likePost: async (req, res) =>{
    if(!ObjectId.isValid(req.params.id))
    return res.send({error : `ID unknown : ${req.params.id}`})
  
    try {
      await productModel.findByIdAndUpdate(
        req.params.id,
      {$addToSet: {likers: req.body.id}},
      {new: true},
      (err, docs)=>{
        if(err) return res.send(err);
      }
    )
    await userModel.findByIdAndUpdate(
      req.body.id,
      {$addToSet: {likes: req.params.id}},
      {new: true},
      (err, docs)=>{
          if(!err) res.send(docs)
            else return res.send(err)
      }
    )
    } catch (err) {
        return res.send("error like");
    }
  },

  unlikePost: async (req, res) =>{
    if(!ObjectId.isValid(req.params.id))
    return res.send({error : `ID unknown : ${req.params.id}`})
  
    try {
      await productModel.findByIdAndUpdate(
        req.params.id,
      {$pull: {likers: req.body.id}},
      {new: true},
      (err, docs)=>{
        if(err) return res.send(err);
      }
    )
    await userModel.findByIdAndUpdate(
      req.body.id,
      {$pull: {likes: req.params.id}},
      {new: true},
      (err, docs)=>{
          if(!err) res.send(docs)
            else return res.send(err)
      }
    )
    } catch (err) {
        return res.status(400).send('error unlike');
    }
  },

  commentPost: (req, res) =>{
    if(!ObjectId.isValid(req.params.id))
    return res.send({error : `ID unknown : ${req.params.id}`})
  
    
    try {
      return productModel.findByIdAndUpdate(
        req.params.id,
        {$push: {
          comments:{
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime()
          }
        }},
        (err, docs)=>{
          if(!err) res.send(docs)
            else return res.send(err)
        }
      )
    } catch (err) {
      return res.send(err);
    }
  },

  editCommentPost: (req, res) =>{
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send({error : `ID unknown : ${req.params.id}`})
  
    try {
      return productModel.findById(
        req.params.id,
        (err, docs)=>{
          const theComment = docs.comments.find(comment => comment._id.equals(req.body.commentId)
          )
  
          if(!theComment) return res.status(404).send("Comment not found")
             theComment.text = req.body.text;
  
          return docs.save(err =>{
            if(!err) return res.send(docs)
            return res.status(500).send(err)   
          })
        }
      )
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  deleteCommentPost: (req, res) =>{
    if(!ObjectId.isValid(req.params.id))
    return res.send({error : `ID unknown : ${req.params.id}`})
  
    try {
      return productModel.findByIdAndUpdate(
        req.params.id,
        {$pull: {comments: {_id: req.body.commentId}}},
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
  
}

module.exports = productCtrl