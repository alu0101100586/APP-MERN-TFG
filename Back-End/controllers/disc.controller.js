const Disc = require('../models/disc.model')
const User = require('../models/user.model')
const Artist = require('../models/artist.model')
const Image = require('../utils/processImage.utils')
const GetId = require('../utils/getUserId.utils')

async function getDiscs(req, res) {
  Disc.find()
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

async function getDiscsByArtist(req, res) {
  const { id } = req.params

  try {
    const artistStorage = await Artist.findById({ _id: id })
    if (!artistStorage) {
      return res.status(404).send({ msg: 'Artista no encontrado' })
    }
    const discsIds = artistStorage.discs

    Disc.find({ _id: { $in: discsIds } })
      .then((discsStorage) => {
        return res.status(200).send(discsStorage)
      })
      .catch(() => {
        return res
          .status(500)
          .send({ msg: 'Error al obtener los discos del artista' })
      })
  } catch (error) {
    return res
      .status(500)
      .send({ msg: 'Error al obtener los discos del artista' })
  }
}

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

  disc.name = disc.name.toLowerCase()

  if (req.files.cover) {
    const imagePath = Image.getFilePath(req.files.cover)
    disc.cover = imagePath
  }

  try {
    const discStorage = await disc.save()

    const userStorage = User.findOneAndUpdate(
      { _id: ownerId },
      {
        $push: { discs: disc._id },
        $addToSet: { musicalGenre: { $each: discStorage.musicalGenre } },
      },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = Artist.findOneAndUpdate(
        { ownerId: disc.ownerId },
        {
          $push: { discs: disc._id },
          $addToSet: { musicalGenre: { $each: discStorage.musicalGenre } },
        },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res.status(201).send(discStorage)
  } catch (error) {
    return res.status(400).send({ msg: 'Error al crear el disco' })
  }
}

async function updateDisc(req, res) {
  const { id } = req.params
  const discData = req.body
  const ownerId = GetId.getUserId(req)

  // Controlando la actualización de la imagen
  if (req.files.cover) {
    const imagePath = Image.getFilePath(req.files.cover)
    discData.cover = imagePath
  } else {
    delete discData.cover
  }

  // Controlando que no se actualiza el ownerId
  if ('ownerId' in discData) {
    return res.status(400).send({ msg: 'No se puede actualizar el ownerId' })
  }

  try {
    const discStorage = await Disc.findOneAndUpdate(
      { _id: id, ownerId: ownerId },
      discData,
      { new: true }
    ).exec()

    if (!discStorage) {
      return res.status(404).send({ msg: 'Disco no encontrado' })
    }

    const userStorage = User.findOneAndUpdate(
      { _id: ownerId },
      { $addToSet: { musicalGenre: { $each: discStorage.musicalGenre } } },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = Artist.findOneAndUpdate(
        { ownerId: ownerId },
        { $addToSet: { musicalGenre: { $each: discStorage.musicalGenre } } },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res.status(200).send({ msg: 'Disco actualizado satisfactoriamente' })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al actualizar el disco' })
  }
}

async function deleteDisc(req, res) {
  const { id } = req.params
  const ownerId = GetId.getUserId(req)

  try {
    const discStorage = await Disc.findOneAndDelete({
      _id: id,
      ownerId: ownerId,
    }).exec()

    if (!discStorage) {
      return res.status(404).send({ msg: 'Disco no encontrado' })
    }

    const userStorage = User.findOneAndUpdate(
      { _id: ownerId },
      { $pull: { discs: id } },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = Artist.findOneAndUpdate(
        { ownerId: ownerId },
        { $pull: { discs: id } },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res.status(200).send({ msg: 'Disco eliminado satisfactoriamente' })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el disco' })
  }
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
  getDiscsByArtist,
  createDisc,
  updateDisc,
  deleteDisc,
  addSong,
  deleteSong,
  buyDisc,
  returnDisc,
}
