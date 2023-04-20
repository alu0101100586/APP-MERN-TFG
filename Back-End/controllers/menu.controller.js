const Menu = require('../models/menu.model')

async function getMenus(req, res) {
  const { show } = req.query
  let menuStorage = null

  if (show === undefined) {
    menuStorage = await Menu.find().sort({ position: 'asc' })
  } else {
    menuStorage = await Menu.find({ show }).sort({ position: 'asc' })
  }

  if (!menuStorage) {
    return res.status(404).send({ msg: 'No hay usuarios' })
  }

  return res.status(200).send(menuStorage)
}

async function createMenu(req, res) {
  const { name, path, position, show } = req.body
  const menu = new Menu({ name, path, position, show })

  menu
    .save()
    .then((menuStorage) => {
      return res.status(201).send(menuStorage)
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al crear el menu' })
    })
}

async function updateMenu(req, res) {
  const { id } = req.params
  const menuData = req.body

  Menu.findByIdAndUpdate({ _id: id }, menuData)
    .then((menuStorage) => {
      if (!menuStorage) {
        return res.status(404).send({ msg: 'Menu no encontrado' })
      }
      return res
        .status(200)
        .send({ msg: 'Menu actualizado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al actualizar el menu' })
    })
}

async function deleteMenu(req, res) {
  const { id } = req.params

  Menu.findByIdAndDelete({ _id: id })
    .then(() => {
      return res.status(200).send({ msg: 'Menu eliminado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al eliminar el menu' })
    })
}

module.exports = {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
}
