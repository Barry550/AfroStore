const productCtrl = require('../controllers/ProductCtrl')
const router = require('express').Router()

const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const upload = require('../utils/multer')


router.route('/product')
  .get(productCtrl.getProducts)
  .post( productCtrl.createProduct)
  


router.route('/product/:id')
  .put( productCtrl.updateProduct)
  .delete(productCtrl.deleteProduct)
  .get(productCtrl.getOneProduct)
  


  router.patch('/like-post/:id', productCtrl.likePost)
  router.patch('/unlike-post/:id', productCtrl.unlikePost)

  router.patch('/comment-post/:id', productCtrl.commentPost)
router.patch('/edit-comment-post/:id', productCtrl.editCommentPost)
router.patch('/delete-comment-post/:id', productCtrl.deleteCommentPost)

  
  
module.exports = router