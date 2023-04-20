const express = require('express')
const newsletterController = require('../controllers/newsletter.controller')
const mwAuth = require('../middlewares/authentication.middleware')

const api = express.Router()

api.get(
  '/get-emails',
  [mwAuth.asureAuthenticated],
  newsletterController.getEmails
)

api.post(
  '/new-subscription',
  [mwAuth.asureAuthenticated],
  newsletterController.newSubscription
)

api.delete(
  '/cancel-subscription',
  [mwAuth.asureAuthenticated],
  newsletterController.cancelSubscription
)

module.exports = api
