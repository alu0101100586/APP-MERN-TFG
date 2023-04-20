const jwt = require('../utils/jwt.utils')

function asureAuthenticated(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(403).send({ msg: 'Cabecera de Autorización no otorgada' })
  }

  const tokenParts = token.replace('Bearer ', '')

  try {
    const payload = jwt.decodeToken(tokenParts)
    const { exp } = payload
    const now = new Date().getTime()

    if (exp <= now) {
      return res.status(403).send({ msg: 'Token expirado' })
    }

    req.user = payload
    next()
  } catch (error) {
    return res.status(403).send({ msg: 'Token no válido' })
  }
}

module.exports = {
  asureAuthenticated,
}
