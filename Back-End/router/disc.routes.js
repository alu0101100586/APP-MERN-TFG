const express = require('express')
const multiparty = require('connect-multiparty')
const discController = require('../controllers/disc.controller')
const mwAuth = require('../middlewares/authentication.middleware')
const mwIsCommon = require('../middlewares/IsCommon.middleware')
const mwIsArtist = require('../middlewares/IsArtist.middleware')
const mwUpload = multiparty({ uploadDir: './uploads/cover' })

const api = express.Router()

api.get('/discs', discController.getDiscs)

api.get('/disc/:id', discController.getDisc)

api.get('/discs/artist/:id', discController.getDiscsByArtist)

api.get(
  '/discs/user',
  [mwAuth.asureAuthenticated],
  discController.getDiscsByUser
)

api.post(
  '/disc',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  discController.createDisc
)

api.patch(
  '/disc/:id',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  discController.updateDisc
)

api.delete(
  '/disc/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  discController.deleteDisc
)

api.post(
  '/disc/song/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  discController.addSong
)

api.delete(
  '/disc/song/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  discController.deleteSong
)

api.patch(
  '/buy/disc/:id',
  [mwAuth.asureAuthenticated, mwIsCommon.asureIsCommon],
  discController.buyDisc
)

api.patch(
  '/return/disc/:id',
  [mwAuth.asureAuthenticated, mwIsCommon.asureIsCommon],
  discController.returnDisc
)

module.exports = api
