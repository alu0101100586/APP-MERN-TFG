const express = require('express');
const multiparty = require('connect-multiparty');
const artistController = require('../controllers/artist.controller');
const mw_auth = require('../middlewares/authentication.middleware');

const mw_upload = multiparty({uploadDir: './uploads/artist'});
const api = express.Router();

api.get('/artists', [ mw_auth.asureAuthenticated ], artistController.getArtists);
api.get('/artist/:id', [ mw_auth.asureAuthenticated ], artistController.getArtist);
api.post('/artist', [ mw_auth.asureAuthenticated, mw_upload ], artistController.createArtist);
api.patch('/artist/:id', [ mw_auth.asureAuthenticated, mw_upload ], artistController.updateArtist);
api.delete('/artist/:id', [ mw_auth.asureAuthenticated ], artistController.deleteArtist);

module.exports = api;

