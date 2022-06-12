const router = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')

router.route('/payment')
  .get(auth, paymentCtrl.getPayments)
  .post(auth, paymentCtrl.createPayment)

module.exports = router
