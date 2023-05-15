const Disc = require('../models/disc.model')
const User = require('../models/user.model')
const Artist = require('../models/artist.model')
const Image = require('../utils/processImage.utils')
const GetId = require('../utils/getUserId.utils')

async function getDiscs(req, res) {
  const { page = 1, limit = 10 } = req.query
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  }

  Disc.paginate({}, options)
    .then((discsStorage) => {
      return res.status(200).send(discsStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener los discos' })
    })
}

async function getDisc(req, res) {
  const { id } = req.params
  Disc.findById({ _id: id })
    .then((discStorage) => {
      if (!discStorage) {
        return res.status(404).send({ msg: 'Disco no encontrado' })
      }
      return res.status(200).send(discStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener el disco' })
    })
}

async function getDiscsByUser(req, res) {
  const { page = 1, limit = 3 } = req.query
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  }
  const userId = GetId.getUserId(req)

  try {
    const userStorage = await User.findById({ _id: userId })
    if (!userStorage) {
      return res.status(404).send({ msg: 'Usuario no encontrado' })
    }
    const discsIds = userStorage.discs

    Disc.paginate({ _id: { $in: discsIds } }, options)
      .then((discsStorage) => {
        return res.status(200).send(discsStorage)
      })
      .catch(() => {
        return res.status(500).send({ msg: 'Error al obtener los discos' })
      })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al obtener los discos' })
  }
}

//TODO - Corregir la creacion de discos cuando no existe un artista
async function createDisc(req, res) {
  const {
    name,
    releaseDate,
    moneyLimit,
    price,
    raisedMoney,
    musicalGenre,
    songs,
  } = req.body
  const ownerId = GetId.getUserId(req)
  const disc = new Disc({
    ownerId,
    name,
    releaseDate,
    moneyLimit,
    price,
    raisedMoney,
    musicalGenre,
    songs,
  })

  if (req.files.cover) {
    const imagePath = Image.getFilePath(req.files.cover)
    disc.cover = imagePath
  }

  disc
    .save()
    .then((discStorage) => {
      User.findOne({ _id: ownerId })
        .then((userStorage) => {
          userStorage.discs.push(disc._id)
          const genresToAdd = discStorage.musicalGenre
          const userStorageGenres = new Set(userStorage.musicalGenre)
          genresToAdd.forEach((genre) => {
            userStorageGenres.add(genre)
          })
          userStorage.musicalGenre = Array.from(userStorageGenres)
          userStorage.save()
        })
        .catch(() => {
          return res
            .status(400)
            .send({ msg: 'Error al actualizar el array de discos del usuario' })
        })

      Artist.findOne({ ownerId: disc.ownerId })
        .then((artistStorage) => {
          artistStorage.discs.push(disc._id)
          const genresToAdd = discStorage.musicalGenre
          const artistStorageGenres = new Set(artistStorage.musicalGenre)
          genresToAdd.forEach((genre) => {
            artistStorageGenres.add(genre)
          })
          artistStorage.musicalGenre = Array.from(artistStorageGenres)
          artistStorage.save()
        })
        .catch(() => {
          return res
            .status(400)
            .send({ msg: 'Error al actualizar el array de discos del artista' })
        })

      return res.status(201).send(discStorage)
    })
    .catch((error) => {
      return res.status(400).send({ msg: 'Error al crear el disco' })
    })
}

//TODO - si se actualiza musiaclgenre, modifical musicalgenre del user y del artista
async function updateDisc(req, res) {
  const { id } = req.params
  const discData = req.body
  const ownerId = GetId.getUserId(req)

  //Controlando la actualizacion de la imagen
  if (req.files.cover) {
    const imagePath = Image.getFilePath(req.files.cover)
    discData.cover = imagePath
  } else {
    delete discData.cover
  }

  //Controlando que no se actualiza el ownerId
  if (
    Object.keys(discData).length === 1 &&
    discData.hasOwnProperty('ownerId')
  ) {
    return res.status(400).send({ msg: 'No se puede actualizar el ownerId' })
  }
  delete discData.ownerId

  Disc.findByIdAndUpdate({ _id: id, ownerId: ownerId }, discData)
    .then((discStorage) => {
      if (!discStorage) {
        return res.status(404).send({ msg: 'Disco no encontrado' })
      }

      return res
        .status(200)
        .send({ msg: 'Disco actualizado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al actualizar el disco' })
    })
}

//TODO - Corregir la eliminacion de discos cuando no existe un artista
async function deleteDisc(req, res) {
  const { id } = req.params
  const ownerId = GetId.getUserId(req)

  Disc.findByIdAndDelete({ _id: id, ownerId: ownerId })
    .then((discStorage) => {
      if (!discStorage) {
        return res.status(404).send({ msg: 'Disco no encontrado' })
      }

      User.findOne({ _id: ownerId })
        .then((userStorage) => {
          userStorage.discs.pull(id)
          userStorage.save()
        })
        .catch(() => {
          return res
            .status(400)
            .send({ msg: 'Error al actualizar el array de discos del usuario' })
        })

      Artist.findOne({ ownerId: ownerId })
        .then((artistStorage) => {
          artistStorage.discs.pull(id)
          artistStorage.save()
        })
        .catch(() => {
          return res
            .status(400)
            .send({ msg: 'Error al actualizar el array de discos del artista' })
        })

      return res.status(200).send({ msg: 'Disco eliminado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar el disco' })
    })
}

async function addSong(req, res) {
  const { id } = req.params
  const { song } = req.body
  const ownerId = GetId.getUserId(req)

  Disc.findById({ _id: id, ownerId: ownerId })
    .then((discStogare) => {
      if (!discStogare) {
        return res.status(404).send({ msg: 'Disco no encontrado' })
      }

      //Controlando que no se añade una canción repetida
      const songExists = discStogare.songs.find((songName) => songName === song)
      if (songExists) {
        return res.status(400).send({ msg: 'La canción ya existe' })
      }

      discStogare.songs.push(song)
      discStogare.save()
      return res.status(200).send({ msg: 'Canción añadida satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al añadir la canción' })
    })
}

async function deleteSong(req, res) {
  const { id } = req.params
  const { song } = req.body
  const ownerId = GetId.getUserId(req)

  Disc.findById({ _id: id, ownerId: ownerId })
    .then((discStogare) => {
      if (!discStogare) {
        return res.status(404).send({ msg: 'Disco no encontrado' })
      }

      //Controlando que la canción a eliminar existe
      const songExists = discStogare.songs.find((songName) => songName === song)
      if (!songExists) {
        return res.status(400).send({ msg: 'La canción no existe' })
      }

      discStogare.songs.pull(song)
      discStogare.save()
      return res
        .status(200)
        .send({ msg: 'Canción eliminada satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar la canción' })
    })
}

async function buyDisc(req, res) {
  const { id } = req.params
  const commonUserId = GetId.getUserId(req)

  Disc.findById({ _id: id })
    .then((discStorage) => {
      if (!discStorage) {
        return res.status(404).send({ msg: 'Disco no encontrado' })
      }

      User.findById({ _id: commonUserId })
        .then((commonUserStorage) => {
          if (!commonUserStorage) {
            return res.status(404).send({ msg: 'Usuario no encontrado' })
          }

          //Controlando que no se compre un disco repetido
          const discExists = commonUserStorage.discs.find(
            (discId) => discId === id
          )
          if (discExists) {
            return res.status(400).send({ msg: 'El disco ya fue comprado' })
          }

          //Actualizacion del dinero acumulado
          const newRaisedMoney = discStorage.price + discStorage.raisedMoney
          discStorage.raisedMoney = newRaisedMoney

          //Actualizacion de los generos musicales en el usuario
          const genresToAdd = discStorage.musicalGenre
          const commonUserStorageGenres = new Set(
            commonUserStorage.musicalGenre
          )
          genresToAdd.forEach((genre) => {
            commonUserStorageGenres.add(genre)
          })
          commonUserStorage.musicalGenre = Array.from(commonUserStorageGenres)

          discStorage.save()

          commonUserStorage.discs.push(id)
          commonUserStorage.save()

          return res
            .status(200)
            .send({ msg: 'Disco comprado satisfactoriamente' })
        })
        .catch(() => {
          return res.status(500).send({ msg: 'Error al comprar el disco' })
        })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al comprar el disco' })
    })
}

async function returnDisc(req, res) {
  const { id } = req.params
  const commonUserId = GetId.getUserId(req)

  Disc.findById({ _id: id }).then((discStorage) => {
    if (!discStorage) {
      return res.status(404).send({ msg: 'Disco no encontrado' })
    }

    User.findById({ _id: commonUserId })
      .then((commonUserStorage) => {
        if (!commonUserStorage) {
          return res.status(404).send({ msg: 'Usuario no encontrado' })
        }

        //Controlando que el disco a devolver existe
        const discExists = commonUserStorage.discs.find(
          (discId) => discId === id
        )
        if (!discExists) {
          return res.status(400).send({ msg: 'El disco no fue comprado' })
        }

        //Actualizacion del dinero acumulado
        const newRaisedMoney = discStorage.raisedMoney - discStorage.price
        discStorage.raisedMoney = newRaisedMoney

        discStorage.save()

        commonUserStorage.discs.pull(id)
        commonUserStorage.save()

        return res
          .status(200)
          .send({ msg: 'Disco devuelto satisfactoriamente' })
      })
      .catch(() => {
        return res.status(500).send({ msg: 'Error al devolver el disco' })
      })
  })
}

module.exports = {
  getDiscs,
  getDisc,
  getDiscsByUser,
  createDisc,
  updateDisc,
  deleteDisc,
  addSong,
  deleteSong,
  buyDisc,
  returnDisc,
}
