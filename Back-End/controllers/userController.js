const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Image = require('../utils/processImage');

async function getMe(req, res) {
  const { user_id } = req.user;

  const response = await User.findById(user_id);

  if (!response) {
    return res.status(404).send({ msg: 'Usuario no encontrado' });
  } else {
    return res.status(200).send(response);
  }
}

async function getUsers(req, res) {
  const { artist } = req.query;
  let response = null;

  if (artist === undefined) {
    response = await User.find();
  } else if (artist === 'true') {
    response = await User.find({ role: 'artist' });
  } else if (artist === 'false') {
    response = await User.find({ role: 'common' });
  }

  if (!response) {
    return res.status(404).send({ msg: 'No hay usuarios' });
  }

  return res.status(200).send(response);

}

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
    .then((response) => {
      return res.status(201).send(response);
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
    .then((response) => {
      return res.status(200).send({ msg: 'Usuario actualizado satisfactoriamente' });
    })
    .catch((err) => {
      return res.status(400).send({ msg: 'Error al actualizar el usuario' });
    });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete({_id: id})
    .then((response) => {
      return res.status(200).send({ msg: 'Usuario eliminado satisfactoriamente' });
    })
    .catch((err) => {
      return res.status(400).send({ msg: 'Error al eliminar el usuario' });
    });
}


module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}