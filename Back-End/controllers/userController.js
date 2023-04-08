const User = require('../models/userModel');

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

module.exports = {
  getMe,
  getUsers,
}