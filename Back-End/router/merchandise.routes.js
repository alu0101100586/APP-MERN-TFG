const express = require('express')
const multiparty = require('connect-multiparty')
const merchController = require('../controllers/merchandise.controller')
const mwAuth = require('../middlewares/authentication.middleware')
const mwNotArtist = require('../middlewares/notArtist.middleware')
const mwNotCommon = require('../middlewares/notCommon.middleware')
const mwUpload = multiparty({ uploadDir: './uploads/image' })

const api = express.Router()

api.get('/merchandise', merchController.getMerchandises)

api.get('/merchandise/:id', merchController.getMerchandise)

api.post(
  '/merchandise',
  [mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon],
  merchController.createMerchandise
)

api.patch(
  '/merchandise/:id',
  [mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon],
  merchController.updateMerchandise
)

api.delete(
  '/merchandise/:id',
  [mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon],
  merchController.deleteMerchandise
)

api.post(
  '/merchandise/:id/size',
  [mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon],
  merchController.addSize
)

api.delete(
  '/merchandise/:id/size',
  [mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon],
  merchController.deleteSize
)

api.patch(
  'buy/merchandise/:id',
  [mwAuth.asureAuthenticated, mwNotArtist.asureNotArtist],
  merchController.buyMerchandise
)

api.patch(
  'return/merchandise/:id',
  [mwAuth.asureAuthenticated, mwNotArtist.asureNotArtist],
  merchController.returnMerchandise
)

module.exports = api
