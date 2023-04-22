const User = require('../models/user.model')
const Artist = require('../models/artist.model')
const bcrypt = require('bcryptjs')
const jwt = require('../utils/jwt.utils')

function signUp(req, res) {
  const {
    nickName,
    firstName,
    lastName,
    email,
    password,
    birthDate,
    role
  } = req.body

  if (!nickName)
    res.status(400).send({ message: 'El nombre de usuario es obligatorio' })

  if (!firstName) res.status(400).send({ message: 'El nombre es obligatorio' })

  if (!lastName) res.status(400).send({ message: 'El apellido es obligatorio' })

  if (!email) res.status(400).send({ message: 'El email es obligatorio' })

  if (!password)
    res.status(400).send({ message: 'La contraseña es obligatoria' })

  if (!birthDate)
    res.status(400).send({ message: 'La fecha de nacimiento es obligatoria' })

  if (!role) res.status(400).send({ message: 'El rol es obligatorio' })

  const user = new User({
    nickName,
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    birthDate,
    role,
  })

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)
  console.log(hashPassword)
  user.password = hashPassword

  user
    .save()
    .then((userStorage) => {
      if (!userStorage) {
        res.status(404).send({ message: 'Error al crear el usuario' })
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
                res.status(404).send({ message: 'Error al crear el artista' })
              } else {
                const responseObj = { user: userStorage, artist: artistStorage }
                res.status(200).send(responseObj)
              }
            })
            .catch((err) => {
              if (err.code === 11000) {
                res.status(500).send({ message: 'El artista ya existe' })
              } else {
                res.status(500).send({ message: 'Error al crear el artista' })
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
        res.status(500).send({ message: 'El usuario ya existe' })
      } else {
        res.status(500).send({ message: 'Error al crear el usuario' })
      }
    })
}

function signIn(req, res) {
  const { email, password } = req.body

  if (!email) res.status(400).send({ message: 'El email es obligatorio' })

  if (!password)
    res.status(400).send({ message: 'La contraseña es obligatoria' })

  const emailLower = email.toLowerCase()

  User.findOne({ email: emailLower })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, check) => {
        if (err) {
          res.status(500).send({ message: 'Error del servidor' })
        } else if (!check) {
          res
            .status(404)
            .send({ message: 'El usuario no se ha podido autenticar' })
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(user),
            refreshToken: jwt.createRefreshToken(user),
          })
        }
      })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send({ message: 'Error del servidor' })
    })
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body

  if (!refreshToken)
    res.status(403).send({ message: 'Refresh token es requerido' })

  const { user_id } = jwt.decodeToken(refreshToken)

  User.findById(user_id)
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Usuario no encontrado' })
      } else {
        res.status(200).send({
          accessToken: jwt.createAccessToken(user),
        })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send({ message: 'Error del servidor' })
    })
}

module.exports = {
  signUp,
  signIn,
  refreshAccessToken,
}
