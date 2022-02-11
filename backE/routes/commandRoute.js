const commandCtrl = require('../controllers/commandCtrl')
const router = require('express').Router()
const auth = require('../middleware/auth')

router.route('/command')
  .get(commandCtrl.getCommand)
  .post(auth, commandCtrl.postCommand)

router.route('/command/:id')
  .patch(commandCtrl.deleteCommand)
  .delete(commandCtrl.deleteCommandAll)

module.exports = router