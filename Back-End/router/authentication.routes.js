const express = require('express')
const authenticationController = require('../controllers/authentication.controller')

const api = express.Router()

api.post('/auth/sign-up', authenticationController.signUp)

api.post('/auth/sign-in', authenticationController.signIn)

api.post(
  '/auth/refresh-access-token',
  authenticationController.refreshAccessToken
)

api.patch(
  '/auth/change-password',
  authenticationController.changePassword
)

module.exports = api
