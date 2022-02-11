const cartCtrl = require('../controllers/cartCtrl')
const router = require('express').Router()

router.route('/cart')
  .post(cartCtrl.createCart)
  .get(cartCtrl.getCart)
  
  router.route('/cart/:id')  
  .patch(cartCtrl.addCart)
  .get(cartCtrl.getIdCart)

module.exports = router