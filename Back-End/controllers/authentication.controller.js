const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt.utils");

function signUp(req, res) {
  const { 
    nickName, 
    firstName, 
    lastName, 
    email, 
    password, 
    birthDate, 
    role
  } = req.body;

  if(!nickName)
    res.status(400).send({ message: "El nombre de usuario es obligatorio"});

  if(!firstName)
    res.status(400).send({ message: "El nombre es obligatorio"});

  if(!lastName)
    res.status(400).send({ message: "El apellido es obligatorio"});

  if(!email)
    res.status(400).send({ message: "El email es obligatorio"});

  if(!password)
    res.status(400).send({ message: "La contraseña es obligatoria"});

  if(!birthDate)
    res.status(400).send({ message: "La fecha de nacimiento es obligatoria"});

  if(!role)
    res.status(400).send({ message: "El rol es obligatorio"});

  const user = new User({
    nickName,
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    birthDate,
    role
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  user.save()
  .then((userStored) => {
    if(!userStored) {
      res.status(404).send({ message: "Error al crear el usuario" });
    } else {
      res.status(200).send({ user: userStored });
    }
  }).catch((err) => {
    if (err.code === 11000) {
      res.status(500).send({ message: "El usuario ya existe" });
    } else {
      console.log(err);
      res.status(500).send({ message: "Error al crear el usuario" });
    }
  });
}

function signIn(req, res) {
  const { email, password } = req.body;

  if(!email)
    res.status(400).send({ message: "El email es obligatorio"});

  if(!password)
    res.status(400).send({ message: "La contraseña es obligatoria"});

  const emailLower = email.toLowerCase();

  User.findOne({ email: emailLower })
    .then(user => {
      bcrypt.compare(password, user.password, (err, check) => {
        if(err) {
          res.status(500).send({ message: "Error del servidor" });
        } else if(!check) {
          res.status(404).send({ message: "El usuario no se ha podido autenticar" });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(user),
            refreshToken: jwt.createRefreshToken(user)
          });
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ message: "Error del servidor" });
    });
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
 
  if(!refreshToken)
    res.status(403).send({ message: "Refresh token es requerido" });

  const { user_id } = jwt.decodeToken(refreshToken);

  User.findById(user_id).exec()
  .then(user => {
    if(!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
    } else {
      res.status(200).send({
        accessToken: jwt.createAccessToken(user)
      });
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).send({ message: "Error del servidor" });
  });
}


module.exports = {
  signUp,
  signIn,
  refreshAccessToken,
}