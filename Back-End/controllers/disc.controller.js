const Disc = require('../models/disc.model');
const User = require('../models/user.model');
const Artist = require('../models/artist.model');
const Image = require('../utils/processImage.utils');
const GetId = require('../utils/getUserId.utils');

async function getDiscs(req, res) {
  const { page = 1, pageItems = 10 } = req.query;
  const options = {
    page: parseInt(page),
    pageItems: parseInt(pageItems),
  };

  Disc.paginate({}, options)
    .then((discsStorage) => {
      return res.status(200).send(discsStorage);
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener los discos' });
    });
}

async function getDisc(req, res) {
  const { id } = req.params;
  Disc.findById({ _id: id })
    .then((discStorage) => {
      if (!discStorage) {
        return res.status(404).send({ msg: 'Disco no encontrado' });
      }
      return res.status(200).send(discStorage);
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al obtener el disco' });
    });
}

async function createDisc(req, res) {
  const { 
    name, 
    releaseDate,
    moneyLimit, 
    raisedMoney, 
    musicalGenre,
    songs 
  } = req.body;
  const ownerId = GetId.getUserId(req);
  const disc = new Disc({
    ownerId,
    name,
    releaseDate,
    moneyLimit,
    raisedMoney,
    musicalGenre,
    songs,
  });

  if(req.files.cover){
    const imagePath = Image.getFilePath(req.files.cover);
    disc.cover = imagePath;
  }

  disc.save()
    .then((discStorage) => {
      User.findOne({ _id: ownerId })
        .then((user) => {
          user.discs.push(disc._id);
          user.save();
        })
        .catch(() => {
          return res.status(400).send({ msg: 'Error al actualizar el array de discos del usuario' });
        });
    
      Artist.findOne({ ownerId: disc.ownerId })
        .then((artist) => {
          artist.discs.push(disc._id);
          artist.save();
        })
        .catch(() => {
          return res.status(400).send({ msg: 'Error al actualizar el array de discos del artista' });
        });

      return res.status(201).send(discStorage);
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al crear el disco' });
    });
}

async function updateDisc(req, res) {
  const { id } = req.params;
  const discData = req.body;

  //Controlando que no se actualiza el ownerId
  if(Object.keys(discData).length === 1 && discData.hasOwnProperty('ownerId')) {
    return res.status(400).send({ msg: 'No se puede actualizar el ownerId' });
  }
  delete discData.ownerId;

  Disc.findByIdAndUpdate({ _id: id }, discData)
    .then((discStorage) => {
      if (!discStorage) {
        return res.status(404).send({ msg: 'Disco no encontrado' });
      }
      return res.status(200).send({ msg: 'Disco actualizado satisfactoriamente' });
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al actualizar el disco' });
    });
}

async function deleteDisc(req, res) {
  const { id } = req.params;
  const ownerId = GetId.getUserId(req);

  Disc.findByIdAndDelete({ _id: id })
    .then(() => {
      User.findOne({ _id: ownerId })
        .then((user) => {
          user.discs.pop(id);
          user.save();
        })
        .catch(() => {
          return res.status(400).send({ msg: 'Error al actualizar el array de discos del usuario' });
        });

      Artist.findOne({ ownerId: ownerId })
        .then((artist) => {
          artist.discs.pop(id);
          artist.save();
        })
        .catch(() => {
          return res.status(400).send({ msg: 'Error al actualizar el array de discos del artista' });
        });

      return res.status(200).send({ msg: 'Disco eliminado satisfactoriamente' });
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar el disco' });
    });
}

async function addSong(req, res) {
  const { id } = req.params;
  const { song } = req.body;
  const ownerId = GetId.getUserId(req);

  Disc.findById({ _id: id, ownerId: ownerId })
    .then((disc) => {
      if (!disc) {
        return res.status(404).send({ msg: 'Disco no encontrado' });
      }

      //Controlando que no se añade una canción repetida
      const songExists = disc.songs.find((songName) => songName === song);
      if(songExists) {
        return res.status(400).send({ msg: 'La canción ya existe' });
      }

      disc.songs.push(song);
      disc.save();
      return res.status(200).send({ msg: 'Canción añadida satisfactoriamente' });
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al añadir la canción' });
    });
}

async function deleteSong(req, res) {
  const { id } = req.params;
  const { song } = req.body;
  const ownerId = GetId.getUserId(req);

  Disc.findById({ _id: id, ownerId: ownerId})
    .then((disc) => {
      if (!disc) {
        return res.status(404).send({ msg: 'Disco no encontrado' });
      }
      disc.songs.pop(song);
      disc.save();
      return res.status(200).send({ msg: 'Canción eliminada satisfactoriamente' });
    })
    .catch(() => {
      return res.status(500).send({ msg: 'Error al eliminar la canción' });
    });
}


module.exports = {
  getDiscs,
  getDisc,
  createDisc,
  updateDisc,
  deleteDisc,
  addSong,
  deleteSong,
}