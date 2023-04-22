const jwt = require('../utils/jwt.utils')

function asureIsArtist(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(403).send({ msg: 'Cabecera de Autorización no otorgada' })
  }

  const tokenParts = token.replace('Bearer ', '')

  try {
    const payload = jwt.decodeToken(tokenParts)
    const { role } = payload

    if (role === 'common') {
      return res
        .status(403)
        .send({ msg: 'No tienes permisos para realizar esta acción' })
    }

    req.user = payload
    next()
  } catch (error) {
    return res.status(403).send({ msg: 'Token no válido' })
  }
}

module.exports = {
  asureIsArtist,
}
