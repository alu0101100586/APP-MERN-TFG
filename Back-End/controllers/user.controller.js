const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Image = require('../utils/processImage.utils')
const Artist = require('../models/artist.model');

async function getMe(req, res) {
  const { user_id } = req.user; 

  const userStorage = await User.findById(user_id);

  if (!userStorage) {
    return res.status(404).send({ msg: 'Usuario no encontrado' });
  } else {
    return res.status(200).send(userStorage);
  }
}

async function getUsers(req, res) {
  const { artist } = req.query;
  let userStorage = null;

  if (artist === undefined) {
    userStorage = await User.find();
  } else if (artist === 'true') {
    userStorage = await User.find({ role: 'artist' });
  } else if (artist === 'false') {
    userStorage = await User.find({ role: 'common' });
  }

  if (!userStorage) {
    return res.status(404).send({ msg: 'No hay usuarios' });
  }

  return res.status(200).send(userStorage);

}

//TODO - Crear el artista y asociarlo al usuario
async function createUser(req, res) {
  const { password } = req.body;
  const user = new User({...req.body});

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  if(req.files.avatar){
    const imagePath = Image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
  }

  user.save()
    .then((userStorage) => {
      return res.status(201).send(userStorage);
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al crear el usuario' });
    });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  // Controlando la actualización de la contraseña
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hashPassword;
  } else {
    delete userData.password;
  }

  // Controlando la actualización de la imagen
  if(req.files.avatar){
    const imagePath = Image.getFilePath(req.files.avatar);
    userData.avatar = imagePath;
  } else {
    delete userData.avatar;
  }

  // Controlando la actualización del rol
  if (Object.keys(userData).length === 1 && userData.hasOwnProperty('role')) {
    return res.status(400).send({ msg: 'No está permitido la actualización del rol' });
  }
  delete userData.role;

  User.findByIdAndUpdate({_id: id}, userData)
    .then((userStorage) => {
      if(!userStorage) {
        return res.status(404).send({ msg: 'Usuario no encontrado' });
      }
      return res.status(200).send({ msg: 'Usuario actualizado satisfactoriamente' });
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al actualizar el usuario' });
    });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete({_id: id})
    .then((user) => {
      // if (user.role === 'artist') {
      //   Artist.findOneAndDelete({ownerId: id})
      //   .then(() => {
      //     return res.status(200).send({ msg: 'Artista eliminado satisfactoriamente' });
      //   })
      //   .catch(() => {
      //     return res.status(400).send({ msg: 'Error al eliminar el artista' });
      //   });
      // }
      return res.status(200).send({ msg: 'Usuario eliminado satisfactoriamente' });
    })
    .catch(() => {
      return res.status(400).send({ msg: 'Error al eliminar el usuario' });
    });
}

// TODO- Si el usuario es de tipo artista, cuando éste se elimine tiene que eliminarse todos sus discos, conciertos y merchandising
// evidentemente si que se tiene que eliminar el artista asociado al usuario
// Preguntar al profesor si lo quiere así o si simplemente se elimina el usuario y se deja todo lo demás

// TODO - crear la funcionalidad que permita al propio usuario a cambiar su ionfo y eliminarse a sí mismo

module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}