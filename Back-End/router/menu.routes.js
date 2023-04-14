const express = require('express');
const menuController = require('../controllers/menu.controller');
const mw_auth = require('../middlewares/authentication.middleware');

const api = express.Router();

api.post('/menu', [mw_auth.asureAuthenticated], menuController.createMenu);
api.get('/menus', [mw_auth.asureAuthenticated], menuController.getMenus);
api.patch('/menu/:id', [mw_auth.asureAuthenticated], menuController.updateMenu);
api.delete('/menu/:id', [mw_auth.asureAuthenticated], menuController.deleteMenu);

module.exports = api;