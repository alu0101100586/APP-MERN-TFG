const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const Image = require('../utils/processImage.utils')
const Artist = require('../models/artist.model')

async function getMe(req, res) {
  const { user_id } = req.user

  const userStorage = await User.findById(user_id)

  if (!userStorage) {
    return res.status(404).send({ msg: 'Usuario no encontrado' })
  } else {
    return res.status(200).send(userStorage)
  }
}

async function getUsers(req, res) {
  const { artist } = req.query
  let userStorage = null

  if (artist === undefined) {
    userStorage = await User.find()
  } else if (artist === 'true') {
    userStorage = await User.find({ role: 'artist' })
  } else if (artist === 'false') {
    userStorage = await User.find({ role: 'common' })
  }

  if (!userStorage) {
    return res.status(404).send({ msg: 'No hay usuarios' })
  }

  return res.status(200).send(userStorage)
}

async function createUser(req, res) {
  const { password } = req.body
  const user = new User({ ...req.body })

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)
  user.password = hashPassword

  if (req.files.avatar) {
    const imagePath = Image.getFilePath(req.files.avatar)
    user.avatar = imagePath
  }

  user
    .save()
    .then((userStorage) => {
      if (!userStorage) {
        res.status(404).send({ msg: 'Error al crear el usuario' })
      } else {
        if (userStorage.role === 'artist') {
          const artist = new Artist({
            ownerId: userStorage._id,
            name: userStorage.nickName,
            startDate: userStorage.birthDate,
          })
          artist
            .save()
            .then((artistStorage) => {
              if (!artistStorage) {
                res.status(404).send({ msg: 'Error al crear el artista' })
              } else {
                const responseObj = { user: userStorage, artist: artistStorage }
                res.status(200).send(responseObj)
              }
            })
            .catch((err) => {
              if (err.code === 11000) {
                res.status(500).send({ msg: 'El artista ya existe' })
              } else {
                res.status(500).send({ msg: 'Error al crear el artista' })
              }
            })
        } else {
          const responseObj = { user: userStorage }
          res.status(200).send(responseObj)
        }
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).send({ msg: 'El usuario ya existe' })
      } else {
        res.status(500).send({ msg: 'Error al crear el usuario' })
      }
    })
}

async function updateUser(req, res) {
  const { id } = req.params
  const userData = req.body

  // Controlando la actualización de la contraseña
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(userData.password, salt)
    userData.password = hashPassword
  } else {
    delete userData.password
  }

  // Controlando la actualización de la imagen
  if (req.files.avatar) {
    const imagePath = Image.getFilePath(req.files.avatar)
    userData.avatar = imagePath
  } else {
    delete userData.avatar
  }

  // Controlando la actualización del rol
  if (Object.keys(userData).length === 1 && userData.hasOwnProperty('role')) {
    return res
      .status(400)
      .send({ msg: 'No está permitido la actualización del rol' })
  }
  delete userData.role

  User.findByIdAndUpdate({ _id: id }, userData)
    .then((userStorage) => {
      if (!userStorage) {
        return res.status(404).send({ msg: 'Usuario no encontrado' })
      }
      return res
        .status(200)
        .send({ msg: 'Usuario actualizado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al actualizar el usuario' })
    })
}

// Si el usuario es de tipo artista, cuando éste se elimine tiene que eliminarse todos sus discos, conciertos y merchandising
// Preguntar al profesor si lo quiere así o si simplemente se elimina el usuario y se deja todo lo demás

async function deleteUser(req, res) {
  const { id } = req.params

  User.findByIdAndDelete({ _id: id })
    .then((userStorage) => {
      if (!userStorage) {
        return res.status(404).send({ msg: 'Usuario no encontrado' })
      } else {
        if (userStorage.role === 'artist') {
          Artist.findOneAndDelete({ ownerId: userStorage._id })
            .then((artistStorage) => {
              if (!artistStorage) {
                res.status(404).send({ msg: 'Error al crear el artista' })
              }
              res
                .status(200)
                .send({ msg: 'Usuario y Artista eliminado satisfactoriamente' })
            })
            .catch(() => {
              res.status(500).send({ msg: 'Error al eliminar el artista' })
            })
        } else {
          return res
            .status(200)
            .send({ msg: 'Usuario eliminado satisfactoriamente' })
        }
      }
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al eliminar el usuario' })
    })
}

module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}
