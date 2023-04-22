const express = require('express')
const multiparty = require('connect-multiparty')
const artistController = require('../controllers/artist.controller')
const mwAuth = require('../middlewares/authentication.middleware')
const mwIsArtist = require('../middlewares/IsArtist.middleware')
const mwUpload = multiparty({ uploadDir: './uploads/artist' })

const api = express.Router()

api.get('/artists', artistController.getArtists)

api.get('/artist/:id', artistController.getArtist)

api.post(
  '/artist',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  artistController.createArtist
)

api.patch(
  '/artist/me',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  artistController.updateArtist
)

api.delete(
  '/artist/me',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  artistController.deleteArtist
)

module.exports = api
