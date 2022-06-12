const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const router = require('express').Router()


//auth
router.post('/register', userCtrl.register)

router.get('/', userCtrl.getUsers)  

router.post('/login', userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshtoken)

router.get('/infor',auth , userCtrl.getUser)

router.get('/infore/:id', userCtrl.getUserId)

router.patch('/addCart', auth, userCtrl.addCart)

router.get('/history', auth, userCtrl.history)

router.get('/listes', auth, userCtrl.listes)



module.exports = router