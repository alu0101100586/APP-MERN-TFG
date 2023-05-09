const Artist = require('../models/artist.model')
const User = require('../models/user.model')
const Image = require('../utils/processImage.utils')
const GetId = require('../utils/getUserId.utils')

async function getArtists(req, res) {
  const { page = 1, pageItems = 10 } = req.query
  const options = {
    page: parseInt(page),
    pageItems: parseInt(pageItems),
  }

  Artist.paginate({}, options)
    .then((artistsStorage) => {
      return res.status(200).send(artistsStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener los artistas' })
    })
}

async function getOwnerArtist(req, res) {
  const { id } = req.params
  Artist.findOne({ ownerId: id })
    .then((artistStorage) => {
      if (!artistStorage) {
        return res.status(404).send({ msg: 'Artista no encontrado' })
      }
      return res.status(200).send(artistStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener el artista' })
    })
}

async function getArtist(req, res) {
  const { id } = req.params
  Artist.findById({ _id: id })
    .then((artistStorage) => {
      if (!artistStorage) {
        return res.status(404).send({ msg: 'Artista no encontrado' })
      }
      return res.status(200).send(artistStorage)
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener el artista' })
    })
}

//TODO - hay que modificar ésta función para que solo haya que ingresar el nombre, fecha inicio e imagen y el resto se pone del usuario que lo crea
async function createArtist(req, res) {
  const { name, startDate } = req.body
  const ownerId = GetId.getUserId(req)

  const userStorage = await User.findById({ _id: ownerId})
  const { musicalGenre, discs, concerts, merchandise} = userStorage;
  const artist = new Artist({ ownerId, name, startDate, musicalGenre, discs, concerts, merchandise })

  if (req.files.avatar) {
    const imagePath = Image.getFilePath(req.files.avatar)
    artist.avatar = imagePath
  }

  artist
    .save()
    .then((artistStorage) => {
      return res.status(201).send(artistStorage)
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al crear el artista' })
    })
}

async function updateArtist(req, res) {
  const { user_id } = req.user
  const artistData = req.body

  Artist.findOneAndUpdate({ ownerId: user_id }, artistData)
    .then((artistStorage) => {
      if (!artistStorage) {
        return res.status(404).send({ msg: 'Artista no encontrado' })
      }
      return res
        .status(200)
        .send({ msg: 'Artista actualizado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al actualizar el artista' })
    })
}

async function deleteArtist(req, res) {
  const { user_id } = req.user

  Artist.findOneAndDelete({ ownerId: user_id })
    .then((artistStorage) => {
      if (!artistStorage) {
        return res.status(404).send({ msg: 'Artista no encontrado' })
      }
      return res
        .status(200)
        .send({ msg: 'Artista eliminado satisfactoriamente' })
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar el artista' })
    })
}

module.exports = {
  getArtists,
  getArtist,
  getOwnerArtist,
  createArtist,
  updateArtist,
  deleteArtist,
}
