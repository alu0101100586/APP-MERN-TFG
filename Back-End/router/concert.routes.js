const express = require('express');
const multiparty = require('connect-multiparty');
const concertController = require('../controllers/concert.controller');
const mwAuth = require('../middlewares/authentication.middleware');
const mwNotCommon = require('../middlewares/notCommon.middleware');
const mwUpload = multiparty({ uploadDir: './uploads/poster' });

const api = express.Router();

api.get(
  '/concerts',
  concertController.getConcerts
);

api.get(
  '/concert/:id',
  concertController.getConcert
);

api.post(
  '/concert',
  [ mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon ],
  concertController.createConcert
);

api.patch(
  '/concert/:id',
  [ mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon ],
  concertController.updateConcert
);

api.delete(
  '/concert/:id',
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ],
  concertController.deleteConcert
);

api.post(
  '/concert/:id/participant',
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ],
  concertController.addParticipant
);

api.delete(
  '/concert/:id/participant',
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ],
  concertController.deleteParticipant
);

module.exports = api;