const Concert = require('../models/concert.model')
const User = require('../models/user.model')
const Artist = require('../models/artist.model')
const Image = require('../utils/processImage.utils')
const GetId = require('../utils/getUserId.utils')

async function getConcerts(req, res) {
  Concert.find()
    .then((concertsStorage) => {
      return res.status(200).send(concertsStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener los conciertos' })
    })
}

async function getConcert(req, res) {
  const { id } = req.params
  Concert.findById({ _id: id })
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }
      return res.status(200).send(concertStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener el concierto' })
    })
}

async function getConcertsByUser(req, res) {
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
    const concertsIds = userStorage.concerts

    Concert.paginate({ _id: { $in: concertsIds } }, options)
      .then((concertsStorage) => {
        return res.status(200).send(concertsStorage)
      })
      .catch(() => {
        return res.status(500).send({ msg: 'Error al obtener los conciertos' })
      })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al obtener los conciertos' })
  }
}

async function getConcertsByArtist(req, res) {
  const { id } = req.params
  const options = {
    page: parseInt(1),
    limit: parseInt(3),
  }

  try {
    const artistStorage = await Artist.findById({ _id: id })
    if (!artistStorage) {
      return res.status(404).send({ msg: 'Artista no encontrado' })
    }
    const concertsIds = artistStorage.concerts

    Concert.paginate({ _id: { $in: concertsIds } }, options)
      .then((concertsStorage) => {
        return res.status(200).send(concertsStorage)
      })
      .catch(() => {
        return res.status(500).send({ msg: 'Error al obtener los conciertos del artista' })
      })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al obtener los conciertos del artista' })
  }
}

async function createConcert(req, res) {
  const {
    name,
    date,
    location,
    moneyLimit,
    price,
    raisedMoney,
    musicalGenre,
    participants,
  } = req.body
  const ownerId = GetId.getUserId(req)
  const concert = new Concert({
    ownerId,
    name,
    date,
    location,
    moneyLimit,
    price,
    raisedMoney,
    musicalGenre,
    participants,
  })

  concert.name = concert.name.toLowerCase()

  if (req.files.concertPoster) {
    const imagePath = Image.getFilePath(req.files.concertPoster)
    concert.concertPoster = imagePath
  }

  try {
    const concertStorage = await concert.save()

    const userStorage = await User.findOneAndUpdate(
      { _id: ownerId },
      {
        $push: { concerts: concertStorage._id },
        $addToSet: { musicalGenre: { $each: concertStorage.musicalGenre } },
      },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = await Artist.findOneAndUpdate(
        { ownerId: ownerId },
        {
          $push: { concerts: concertStorage._id },
          $addToSet: { musicalGenre: { $each: concertStorage.musicalGenre } },
        },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res.status(201).send(concertStorage)
  } catch (error) {
    return res.status(500).send({ msg: 'Error al crear el concierto' })
  }
}

async function updateConcert(req, res) {
  const { id } = req.params
  const concertData = req.body
  const ownerId = GetId.getUserId(req)

  //Controlando la actualizacion de la imagen
  if (req.files.concertPoster) {
    const imagePath = Image.getFilePath(req.files.concertPoster)
    concertData.concertPoster = imagePath
  } else {
    delete concertData.concertPoster
  }

  if (
    Object.keys(concertData).length === 1 &&
    concertData.hasOwnProperty('ownerId')
  ) {
    return res.status(400).send({ msg: 'No se puede actualizar el ownerId' })
  }
  delete concertData.ownerId

  try {
    const concertStorage = await Concert.findOneAndUpdate(
      { _id: id, ownerId: ownerId },
      concertData,
      { new: true }
    ).exec()

    if (!concertStorage) {
      return res.status(404).send({ msg: 'Concierto no encontrado' })
    }

    const userStorage = await User.findOneAndUpdate(
      { _id: ownerId },
      { $addToSet: { musicalGenre: { $each: concertStorage.musicalGenre } } },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = await Artist.findOneAndUpdate(
        { ownerId: ownerId },
        { $addToSet: { musicalGenre: { $each: concertStorage.musicalGenre } } },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res
      .status(200)
      .send({ msg: 'Concierto actualizado satisfactoriamente' })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al actualizar el concierto' })
  }
}

async function deleteConcert(req, res) {
  const { id } = req.params
  const ownerId = GetId.getUserId(req)

  try {
    const concertStorage = await Concert.findOneAndDelete({
      _id: id,
      ownerId: ownerId,
    }).exec()

    if (!concertStorage) {
      return res.status(404).send({ msg: 'Concierto no encontrado' })
    }

    const userStorage = await User.findOneAndUpdate(
      { _id: ownerId },
      { $pull: { concerts: concertStorage._id } },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = await Artist.findOneAndUpdate(
        { ownerId: ownerId },
        { $pull: { concerts: concertStorage._id } },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res
      .status(200)
      .send({ msg: 'Concierto eliminado satisfactoriamente' })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el Concierto' })
  }
}

async function addParticipant(req, res) {
  const { id } = req.params
  const { artist } = req.body
  const ownerId = GetId.getUserId(req)

  Concert.findById({ _id: id, ownerId: ownerId })
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }

      const artistExists = concertStorage.participants.find(
        (artistName) => artistName === artist
      )

      if (artistExists) {
        return res
          .status(400)
          .send({ msg: 'El artista ya está en el concierto' })
      }

      concertStorage.participants.push(artist)
      concertStorage.save()
      return res
        .status(200)
        .send({ msg: 'Participante añadido satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al añadir participante' })
    })
}

async function deleteParticipant(req, res) {
  const { id } = req.params
  const { artistName } = req.body
  const ownerId = GetId.getUserId(req)

  Concert.findById({ _id: id, ownerId: ownerId })
    .then((concertStogare) => {
      if (!concertStogare) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }

      //Controlando que el artista a eliminar existe
      const artistExists = concertStogare.participants.find(
        (artist) => artist === artistName
      )
      if (!artistExists) {
        return res.status(400).send({ msg: 'La canción no existe' })
      }

      concertStogare.participants.pull(artistName)
      concertStogare.save()
      return res
        .status(200)
        .send({ msg: 'Canción eliminada satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al añadir participante' })
    })
}

async function buyTicket(req, res) {
  const { id } = req.params
  const commonUserId = GetId.getUserId(req)

  Concert.findById({ _id: id })
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concerto no encontrado' })
      }

      User.findById({ _id: commonUserId })
        .then((commonUserStorage) => {
          if (!commonUserStorage) {
            return res.status(404).send({ msg: 'Usuario no encontrado' })
          }

          //Controlando que no se compre un concierto repetido
          const concertExists = commonUserStorage.concerts.find(
            (concertId) => concertId === id
          )
          if (concertExists) {
            return res.status(400).send({ msg: 'El Concerto ya fue comprado' })
          }

          //Actualizacion del dinero acumulado
          const newRaisedMoney =
            concertStorage.price + concertStorage.raisedMoney
          concertStorage.raisedMoney = newRaisedMoney

          //Actualizacion de los generos musicales en el usuario
          const genresToAdd = concertStorage.musicalGenre
          const commonUserStorageGenres = new Set(
            commonUserStorage.musicalGenre
          )
          genresToAdd.forEach((genre) => {
            commonUserStorageGenres.add(genre)
          })
          commonUserStorage.musicalGenre = Array.from(commonUserStorageGenres)

          concertStorage.save()

          commonUserStorage.concerts.push(id)
          commonUserStorage.save()

          return res
            .status(200)
            .send({ msg: 'Concerto comprado satisfactoriamente' })
        })
        .catch(() => {
          return res.status(500).send({ msg: 'Error al comprar el concierto' })
        })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al comprar el concierto' })
    })
}

async function returnTicket(req, res) {
  const { id } = req.params
  const commonUserId = GetId.getUserId(req)

  Concert.findById({ _id: id }).then((concertStorage) => {
    if (!concertStorage) {
      return res.status(404).send({ msg: 'Concierto no encontrado' })
    }

    User.findById({ _id: commonUserId })
      .then((commonUserStorage) => {
        if (!commonUserStorage) {
          return res.status(404).send({ msg: 'Usuario no encontrado' })
        }

        //Controlando que el concierto a devolver existe
        const concertExists = commonUserStorage.concerts.find(
          (concertId) => concertId === id
        )
        if (!concertExists) {
          return res.status(400).send({ msg: 'El concierto no fue comprado' })
        }

        //Actualizacion del dinero acumulado
        const newRaisedMoney = concertStorage.raisedMoney - concertStorage.price
        concertStorage.raisedMoney = newRaisedMoney
        concertStorage.save()

        commonUserStorage.concerts.pull(id)
        commonUserStorage.save()

        return res
          .status(200)
          .send({ msg: 'Concierto devuelto satisfactoriamente' })
      })
      .catch(() => {
        return res.status(500).send({ msg: 'Error al devolver el concierto' })
      })
  })
}

module.exports = {
  getConcerts,
  getConcert,
  getConcertsByUser,
  getConcertsByArtist,
  createConcert,
  updateConcert,
  deleteConcert,
  addParticipant,
  deleteParticipant,
  buyTicket,
  returnTicket,
}
