const express = require('express')
const multiparty = require('connect-multiparty')
const merchController = require('../controllers/merchandise.controller')
const mwAuth = require('../middlewares/authentication.middleware')
const mwIsCommon = require('../middlewares/IsCommon.middleware')
const mwIsArtist = require('../middlewares/IsArtist.middleware')
const mwUpload = multiparty({ uploadDir: './uploads/image' })

const api = express.Router()

api.get('/merchandise', merchController.getMerchandises)

api.get('/merchandise/:id', merchController.getMerchandise)

api.get(
  '/merchandises/user',
  [mwAuth.asureAuthenticated], 
  merchController.getMerchandiseByUser
)

api.post(
  '/merchandise',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  merchController.createMerchandise
)

api.patch(
  '/merchandise/:id',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  merchController.updateMerchandise
)

api.delete(
  '/merchandise/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  merchController.deleteMerchandise
)

api.post(
  '/merchandise/:id/size',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  merchController.addSize
)

api.delete(
  '/merchandise/:id/size',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  merchController.deleteSize
)

api.patch(
  'buy/merchandise/:id',
  [mwAuth.asureAuthenticated, mwIsCommon.asureIsCommon],
  merchController.buyMerchandise
)

api.patch(
  'return/merchandise/:id',
  [mwAuth.asureAuthenticated, mwIsCommon.asureIsCommon],
  merchController.returnMerchandise
)

module.exports = api
