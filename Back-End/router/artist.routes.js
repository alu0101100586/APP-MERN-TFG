const express = require('express');
const multiparty = require('connect-multiparty');
const artistController = require('../controllers/artist.controller');
const mwAuth = require('../middlewares/authentication.middleware');
const mwNotCommon = require('../middlewares/notCommon.middleware');
const mwUpload = multiparty({uploadDir: './uploads/artist'});

const api = express.Router();

api.get(
  '/artists', 
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ], 
  artistController.getArtists
);

api.get(
  '/artist/:id', 
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ], 
  artistController.getArtist
);

api.post(
  '/artist', 
  [ mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon ], 
  artistController.createArtist
);

api.patch(
  '/artist/:id', 
  [ mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon ], 
  artistController.updateArtist
);

api.delete(
  '/artist/:id', 
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ], 
  artistController.deleteArtist
);

module.exports = api;

