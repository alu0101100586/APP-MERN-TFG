const Concert = require('../models/concert.model')
const User = require('../models/user.model')
const Artist = require('../models/artist.model')
const Image = require('../utils/processImage.utils')
const GetId = require('../utils/getUserId.utils')

async function getConcerts(req, res) {
  const { page = 1, pageItems = 10 } = req.query
  const options = {
    page: parseInt(page),
    pageItems: parseInt(pageItems),
  }

  Concert.paginate({}, options)
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

async function createConcert(req, res) {
  const {
    name,
    date,
    location,
    moneyLimit,
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
    raisedMoney,
    musicalGenre,
    participants,
  })

  if (req.files.concertPoster) {
    const imagePath = Image.getFilePath(req.files.concertPoster)
    concert.concertPoster = imagePath
  }

  concert
    .save()
    .then((concertStorage) => {
      User.findOne({ _id: ownerId })
        .then((userStorage) => {
          userStorage.concerts.push(concertStorage._id)
          const genresToAdd = concertStorage.musicalGenre
          const userStorageGenres = new Set(userStorage.musicalGenre)
          genresToAdd.forEach((genre) => {
            userStorageGenres.add(genre)
          })
          userStorage.musicalGenre = Array.from(userStorageGenres)
          userStorage.save()
        })
        .catch(() => {
          return res.status(500).send({
            msg: 'Error al actualizar el array de conciertos del usuario',
          })
        })

      Artist.findOne({ ownerId: ownerId })
        .then((artistStorage) => {
          artistStorage.concerts.push(concertStorage._id)
          const genresToAdd = concertStorage.musicalGenre
          const artistStorageGenres = new Set(artistStorage.musicalGenre)
          genresToAdd.forEach((genre) => {
            artistStorageGenres.add(genre)
          })
          artistStorage.musicalGenre = Array.from(artistStorageGenres)
          artistStorage.save()
        })
        .catch(() => {
          return res.status(500).send({
            msg: 'Error al actualizar el array de conciertos del artista',
          })
        })
      return res.status(201).send(concertStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al crear el concierto' })
    })
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

  Concert.findByIdAndUpdate({ _id: id, ownerId: ownerId }, concertData)
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }

      return res
        .status(200)
        .send({ msg: 'Concierto actualizado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al actualizar el concierto' })
    })
}

//corregir
async function deleteConcert(req, res) {
  const { id } = req.params
  const ownerId = GetId.getUserId(req)

  Concert.findByIdAndDelete({ _id: id, ownerId: ownerId })
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }

      User.findOne({ _id: ownerId })
        .then((userStorage) => {
          userStorage.concerts.pull(id)
          userStorage.save()
        })
        .catch(() => {
          return res.status(400).send({
            msg: 'Error al actualizar el array de conciertos del usuario',
          })
        })

      Artist.findOne({ ownerId: ownerId })
        .then((artistStorage) => {
          artistStorage.concerts.pull(id)
          artistStorage.save()
        })
        .catch(() => {
          return res.status(400).send({
            msg: 'Error al actualizar el array de conciertos del artista',
          })
        })

      return res
        .status(200)
        .send({ msg: 'Concierto eliminado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar el Concierto' })
    })
}

async function addParticipant(req, res) {
  const { id } = req.params
  const { artistName } = req.body
  const ownerId = GetId.getUserId(req)

  Concert.findById({ _id: id, ownerId: ownerId })
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }

      Artist.findOne({ name: artistName })
        .then((artistStorage) => {
          if (!artistStorage) {
            return res.status(404).send({ msg: 'Artista no encontrado' })
          }

          //Controlando que el artista no esté ya en el array de participantes
          if (concertStorage.participants.includes(artistStorage._id)) {
            return res
              .status(400)
              .send({ msg: 'El artista ya está en el concierto' })
          }

          concertStorage.participants.push(artist._id)
          concertStorage
            .save()
            .then(() => {
              return res.status(200).send(concertStorage)
            })
            .catch(() => {
              return res
                .status(500)
                .send({ msg: 'Error al añadir participante' })
            })
        })
        .catch(() => {
          return res.status(500).send({ msg: 'Error al añadir participante' })
        })
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
    .then((concertStorage) => {
      if (!concertStorage) {
        return res.status(404).send({ msg: 'Concierto no encontrado' })
      }

      Artist.findOne({ name: artistName })
        .then((artistStorage) => {
          if (!artistStorage) {
            return res.status(404).send({ msg: 'Artista no encontrado' })
          }

          //Controlando que el artista no esté ya en el array de participantes
          if (!concertStorage.participants.includes(artistStorage._id)) {
            return res
              .status(400)
              .send({ msg: 'El artista no está en el concierto' })
          }

          concertStorage.participants.pull(artistStorage._id)
          concertStorage
            .save()
            .then(() => {
              return res.status(200).send(concertStorage)
            })
            .catch(() => {
              return res
                .status(500)
                .send({ msg: 'Error al añadir participante' })
            })
        })
        .catch(() => {
          return res.status(500).send({ msg: 'Error al añadir participante' })
        })
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
  createConcert,
  updateConcert,
  deleteConcert,
  addParticipant,
  deleteParticipant,
  buyTicket,
  returnTicket,
}
