const express = require('express')
const menuController = require('../controllers/menu.controller')
const mwAuth = require('../middlewares/authentication.middleware')
const mwIsAdmin = require('../middlewares/isAdmin.middleware')

const api = express.Router()

api.post(
  '/menu',
  [mwAuth.asureAuthenticated, mwIsAdmin.asureIsAdmin],
  menuController.createMenu
)

api.get(
  '/menus',
  [mwAuth.asureAuthenticated, mwIsAdmin.asureIsAdmin],
  menuController.getMenus
)

api.patch(
  '/menu/:id',
  [mwAuth.asureAuthenticated, mwIsAdmin.asureIsAdmin],
  menuController.updateMenu
)

api.delete(
  '/menu/:id',
  [mwAuth.asureAuthenticated, mwIsAdmin.asureIsAdmin],
  menuController.deleteMenu
)

module.exports = api
