const { pacthCategory } = require('../controllers/categoryCtrl')
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

const router = require('express').Router()

router.route('/category')
  .get(categoryCtrl.getCategory)
  .post(categoryCtrl.createCategory)

router.route('/category/:id')
  .put(categoryCtrl.updateCategory)
  .delete(categoryCtrl.deleteCategory)



module.exports = router 