const express = require('express');
const multiparty = require('connect-multiparty');
const discController = require('../controllers/disc.controller');
const mwAuth = require('../middlewares/authentication.middleware');
const mwNotCommon = require('../middlewares/notCommon.middleware');
const mwUpload = multiparty({ uploadDir: './uploads/cover' });

const api = express.Router();

api.get(
  '/discs', 
  [ mwAuth.asureAuthenticated ], 
  discController.getDiscs
);

api.get(
  '/disc/:id', 
  [ mwAuth.asureAuthenticated ], 
  discController.getDisc
);

api.post(
  '/disc', 
  [ mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon ], 
  discController.createDisc
);

api.patch(
  '/disc/:id', 
  [ mwAuth.asureAuthenticated, mwUpload, mwNotCommon.asureNotCommon ], 
  discController.updateDisc
);

api.delete(
  '/disc/:id', 
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ], 
  discController.deleteDisc
);

api.post(
  '/disc/:id/song',
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ],
  discController.addSong
);

api.delete(
  '/disc/:id/song',
  [ mwAuth.asureAuthenticated, mwNotCommon.asureNotCommon ],
  discController.deleteSong
);

module.exports = api;