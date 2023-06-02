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

async function getMerchandisesByArtist(req, res) {
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
    const merchsIds = artistStorage.merchandise

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

  try {
    const merchStorage = await merchandise.save()

    const userStorage = await User.findOneAndUpdate(
      { _id: ownerId },
      { $push: { merchandise: merchStorage._id } },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = await Artist.findOneAndUpdate(
        { ownerId: ownerId },
        { $push: { merchandise: merchStorage._id } },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res.status(201).send(merchStorage)
  } catch (error) {
    return res.status(500).send({ msg: 'Error al crear el merchandise' })
  }
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

  try {
    const merchStorage = await Merchandise.findByIdAndDelete({
      _id: id,
      ownerId: ownerId,
    }).exec()

    if (!merchStorage) {
      return res.status(404).send({ msg: 'Merchandise no encontrado' })
    }

    const userStorage = await User.findOneAndUpdate(
      { _id: ownerId },
      { $pull: { merchandise: id } },
      { new: true }
    ).exec()

    let artistStorage
    if (ownerId) {
      artistStorage = await Artist.findOneAndUpdate(
        { ownerId: ownerId },
        { $pull: { merchandise: id } },
        { new: true }
      ).exec()
    }

    await Promise.all([userStorage, artistStorage])

    return res
      .status(200)
      .send({ msg: 'Merchandise eliminado satisfactoriamente' })
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el merchandise' })
  }
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
          const merchandiseExists = commonUserStorage.merchandise.find(
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

          commonUserStorage.merchandise.push(id)
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
        const merchandiseExists = commonUserStorage.merchandise.find(
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

        commonUserStorage.merchandise.pull(id)
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
  getMerchandisesByArtist,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
  addSize,
  deleteSize,
  buyMerchandise,
  returnMerchandise,
}
