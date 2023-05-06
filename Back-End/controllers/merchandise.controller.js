const Merchandise = require('../models/merchandise.model')
const User = require('../models/user.model')
const Artist = require('../models/artist.model')
const Image = require('../utils/processImage.utils')
const GetId = require('../utils/getUserId.utils')

async function getMerchandises(req, res) {
  const { page = 1, pageItems = 10 } = req.query
  const options = {
    page: parseInt(page),
    pageItems: parseInt(pageItems),
  }

  Merchandise.paginate({}, options)
    .then((merchStorage) => {
      return res.status(200).send(merchStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener los Merchandises' })
    })
}

async function getMerchandiseByUser(req, res) {
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
    const merchsIds = userStorage.merchandise

    Merchandise.paginate({ _id: { $in: merchsIds } }, options)
      .then((merchsStorage) => {
        return res.status(200).send(merchsStorage)
      })
      .catch(() => {
        return res
          .status(500)
          .send({ msg: 'Error al obtener los merchandises' })
      })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al obtener los merchandises' })
  }
}

async function getMerchandise(req, res) {
  const { id } = req.params
  Merchandise.findById({ _id: id })
    .then((merchStorage) => {
      if (!merchStorage) {
        return res.status(404).send({ msg: 'Merchandise no encontrado' })
      }
      return res.status(200).send(merchStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener el merchandise' })
    })
}

async function createMerchandise(req, res) {
  const {
    name,
    releaseDate,
    moneyLimit,
    price,
    raisedMoney,
    size,
    description,
  } = req.body
  const ownerId = GetId.getUserId(req)
  const merchandise = new Merchandise({
    ownerId,
    name,
    releaseDate,
    moneyLimit,
    price,
    raisedMoney,
    size,
    description,
  })

  if (req.files.image) {
    const imagePath = Image.getFilePath(req.files.image)
    merchandise.image = imagePath
  }

  merchandise
    .save()
    .then((merchStorage) => {
      User.findOne({ _id: ownerId })
        .then((user) => {
          user.merchandise.push(merchandise._id)
          user.save()
        })
        .catch(() => {
          return res
            .status(400)
            .send({ msg: 'Error al actualizar el array de discos del usuario' })
        })

      Artist.findOne({ ownerId: merchandise.ownerId })
        .then((artist) => {
          artist.merchandise.push(merchandise._id)
          artist.save()
        })
        .catch(() => {
          return res
            .status(400)
            .send({ msg: 'Error al actualizar el array de discos del artista' })
        })

      return res.status(201).send(merchStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al crear el merchandise' })
    })
}

async function updateMerchandise(req, res) {
  const { id } = req.params
  const merchData = req.body
  const ownerId = GetId.getUserId(req)

  //Controlando la actualizacion de imagen
  if (req.files.image) {
    const imagePath = Image.getFilePath(req.files.image)
    merchData.image = imagePath
  } else {
    delete merchData.image
  }

  //Controlando que no se actualiza el ownerId
  if (
    Object.keys(merchData).length === 1 &&
    merchData.hasOwnProperty('ownerId')
  ) {
    return res.status(400).send({ msg: 'No se puede actualizar el ownerId' })
  }
  delete merchData.ownerId

  Merchandise.findByIdAndUpdate({ _id: id, ownerId: ownerId }, merchData)
    .then((merchStorage) => {
      if (!merchStorage) {
        return res.status(404).send({ msg: 'Merchandise no encontrado' })
      }
      return res
        .status(200)
        .send({ msg: 'Merchandise actualizado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al actualizar el merchandise' })
    })
}

async function deleteMerchandise(req, res) {
  const { id } = req.params
  const ownerId = GetId.getUserId(req)

  Merchandise.findByIdAndDelete({ _id: id, ownerId: ownerId })
    .then((merchStorage) => {
      if (!merchStorage) {
        return res.status(404).send({ msg: 'Merchandise no encontrado' })
      }

      User.findOne({ _id: ownerId })
        .then((user) => {
          user.merchandise.pull(id)
          user.save()
        })
        .catch(() => {
          return res.status(400).send({
            msg: 'Error al actualizar el array de merchandise del usuario',
          })
        })

      Artist.findOne({ ownerId: ownerId })
        .then((artist) => {
          artist.merchandise.pull(id)
          artist.save()
        })
        .catch(() => {
          return res.status(400).send({
            msg: 'Error al actualizar el array de merchandise del artista',
          })
        })

      return res
        .status(200)
        .send({ msg: 'Merchandise eliminado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar el merchandise' })
    })
}

async function addSize(req, res) {
  const { id } = req.params
  const { size } = req.body
  const ownerId = GetId.getUserId(req)

  Merchandise.findById({ _id: id, ownerId: ownerId })
    .then((merchStorage) => {
      if (!merchStorage) {
        return res.status(404).send({ msg: 'Merchandise no encontrado' })
      }

      //Controlando que no se añada un tamaño repetido
      if (merchStorage.size.includes(size)) {
        return res.status(400).send({ msg: 'El tamaño ya existe' })
      }

      merchStorage.size.push(size)
      merchStorage.save()
      return res.status(200).send(merchStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al añadir el tamaño' })
    })
}

async function deleteSize(req, res) {
  const { id } = req.params
  const { size } = req.body
  const ownerId = GetId.getUserId(req)

  Merchandise.findById({ _id: id, ownerId: ownerId })
    .then((merchStorage) => {
      if (!merchStorage) {
        return res.status(404).send({ msg: 'Merchandise no encontrado' })
      }

      //Controlando que el tamaño exista
      if (!merchStorage.size.includes(size)) {
        return res.status(400).send({ msg: 'El tamaño no existe' })
      }

      merchStorage.size.pull(size)
      merchStorage.save()
      return res.status(200).send(merchStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar el tamaño' })
    })
}

async function buyMerchandise(req, res) {
  const { id } = req.params
  const commonUserId = GetId.getUserId(req)

  Merchandise.findById({ _id: id })
    .then((merchandiseStorage) => {
      if (!merchandiseStorage) {
        return res.status(404).send({ msg: 'Merchandise no encontrado' })
      }

      User.findById({ _id: commonUserId })
        .then((commonUserStorage) => {
          if (!commonUserStorage) {
            return res.status(404).send({ msg: 'Usuario no encontrado' })
          }

          //Controlando que no se compre un merchandise repetido
          const merchandiseExists = commonUserStorage.merchandises.find(
            (merchandiseId) => merchandiseId === id
          )
          if (merchandiseExists) {
            return res
              .status(400)
              .send({ msg: 'El merchandise ya fue comprado' })
          }

          //Actualizacion del dinero acumulado
          const newRaisedMoney =
            merchandiseStorage.price + merchandiseStorage.raisedMoney
          merchandiseStorage.raisedMoney = newRaisedMoney
          merchandiseStorage.save()

          commonUserStorage.merchandises.push(id)
          commonUserStorage.save()

          return res
            .status(200)
            .send({ msg: 'Merchandise comprado satisfactoriamente' })
        })
        .catch(() => {
          return res
            .status(500)
            .send({ msg: 'Error al comprar el merchandise' })
        })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al comprar el merchandise' })
    })
}

async function returnMerchandise(req, res) {
  const { id } = req.params
  const commonUserId = GetId.getUserId(req)

  Merchandise.findById({ _id: id }).then((merchandiseStorage) => {
    if (!merchandiseStorage) {
      return res.status(404).send({ msg: 'Merchandise no encontrado' })
    }

    User.findById({ _id: commonUserId })
      .then((commonUserStorage) => {
        if (!commonUserStorage) {
          return res.status(404).send({ msg: 'Usuario no encontrado' })
        }

        //Controlando que el merchandise a devolver existe
        const merchandiseExists = commonUserStorage.merchandises.find(
          (merchandiseId) => merchandiseId === id
        )
        if (!merchandiseExists) {
          return res.status(400).send({ msg: 'El merchandise no fue comprado' })
        }

        //Actualizacion del dinero acumulado
        const newRaisedMoney =
          merchandiseStorage.raisedMoney - merchandiseStorage.price
        merchandiseStorage.raisedMoney = newRaisedMoney
        merchandiseStorage.save()

        commonUserStorage.merchandises.pull(id)
        commonUserStorage.save()

        return res
          .status(200)
          .send({ msg: 'Merchandise devuelto satisfactoriamente' })
      })
      .catch(() => {
        return res.status(500).send({ msg: 'Error al devolver el merchandise' })
      })
  })
}

module.exports = {
  getMerchandises,
  getMerchandise,
  getMerchandiseByUser,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
  addSize,
  deleteSize,
  buyMerchandise,
  returnMerchandise,
}
