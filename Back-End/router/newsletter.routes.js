const express = require('express');
const newsletterController = require('../controllers/newsletter.controller');
const mw_auth = require('../middlewares/authentication.middleware');

const api = express.Router();

api.get('/get-emails', newsletterController.getEmails);
api.post('/new-subscription', newsletterController.newSubscription);
api.delete('/cancel-subscription', newsletterController.cancelSubscription);

module.exports = api;