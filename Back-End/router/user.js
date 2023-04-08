const express = require('express');
const userController = require('../controllers/userController');
const authMw = require('../middlewares/authMiddleware');

const api = express.Router();

api.get('/user/me', [ authMw.asureAuthenticated ], userController.getMe);
api.get('/users', [ authMw.asureAuthenticated ], userController.getUsers);

module.exports = api;