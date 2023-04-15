const express = require('express');
const multiparty = require ('connect-multiparty');
const userController = require('../controllers/user.controller');
const mwAuth = require('../middlewares/authentication.middleware');

const mw_upload = multiparty({uploadDir: './uploads/avatar'});
const api = express.Router();

api.get('/user/me', [ mwAuth.asureAuthenticated ], userController.getMe);

api.get('/users', [ mwAuth.asureAuthenticated ], userController.getUsers);

api.post(
  '/user', 
  [ mwAuth.asureAuthenticated, mw_upload ], 
  userController.createUser
);

api.patch(
  '/user/:id', 
  [ mwAuth.asureAuthenticated, mw_upload ], 
  userController.updateUser
);

api.delete(
  '/user/:id', 
  [ mwAuth.asureAuthenticated ], 
  userController.deleteUser
);

module.exports = api;