const express = require('express')
const multiparty = require('connect-multiparty')
const concertController = require('../controllers/concert.controller')
const mwAuth = require('../middlewares/authentication.middleware')
const mwIsArtist = require('../middlewares/IsArtist.middleware')
const mwIsCommon = require('../middlewares/IsCommon.middleware')
const mwUpload = multiparty({ uploadDir: './uploads/poster' })

const api = express.Router()

api.get('/concerts', concertController.getConcerts)

api.get('/concert/:id', concertController.getConcert)

api.get(
  '/concerts/user',
  [mwAuth.asureAuthenticated],
  concertController.getConcertsByUser
)

api.post(
  '/concert',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  concertController.createConcert
)

api.patch(
  '/concert/:id',
  [mwAuth.asureAuthenticated, mwUpload, mwIsArtist.asureIsArtist],
  concertController.updateConcert
)

api.delete(
  '/concert/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  concertController.deleteConcert
)

api.post(
  '/concert/participant/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  concertController.addParticipant
)

api.delete(
  '/concert/participant/:id',
  [mwAuth.asureAuthenticated, mwIsArtist.asureIsArtist],
  concertController.deleteParticipant
)

api.patch(
  '/buy/concert-ticket/:id',
  [mwAuth.asureAuthenticated, mwIsCommon.asureIsCommon],
  concertController.buyTicket
)

api.patch(
  '/return/concert-ticket/:id',
  [mwAuth.asureAuthenticated, mwIsCommon.asureIsCommon],
  concertController.returnTicket
)

module.exports = api
