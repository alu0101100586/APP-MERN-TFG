const express = require('express');
const multiparty = require ('connect-multiparty');
const userController = require('../controllers/user.controller');
const authMw = require('../middlewares/authentication.middleware');

const mw_upload = multiparty({uploadDir: './uploads/avatar'});
const api = express.Router();

api.get('/user/me', [ authMw.asureAuthenticated ], userController.getMe);
api.get('/users', [ authMw.asureAuthenticated ], userController.getUsers);
api.post(
  '/user', 
  [ authMw.asureAuthenticated, mw_upload ], 
  userController.createUser
);
api.patch(
  '/user/:id', 
  [ authMw.asureAuthenticated, mw_upload ], 
  userController.updateUser
);
api.delete(
  '/user/:id', 
  [ authMw.asureAuthenticated ], 
  userController.deleteUser
);

module.exports = api;