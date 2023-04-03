const express = require('express');
const authenticationController = require('../controllers/authentication');

const api = express.Router();

api.post('/auth/sign-up', authenticationController.signUp);
api.post('/auth/sign-in', authenticationController.signIn);
api.post('/auth/refresh-access-token', authenticationController.refreshAccessToken);

module.exports = api;