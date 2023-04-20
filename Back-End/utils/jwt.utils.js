const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../constants')

function createAccessToken(user) {
  const expToken = new Date()
  expToken.setHours(expToken.getHours() + 3)

  const payload = {
    token_type: 'access',
    user_id: user._id,
    role: user.role,
    iat: Date.now(),
    exp: expToken.getTime(),
  }

  return jwt.sign(payload, JWT_SECRET_KEY)
}

function createRefreshToken(user) {
  const expToken = new Date()
  expToken.setDate(expToken.getDate() + 7)

  const payload = {
    token_type: 'refresh',
    user_id: user._id,
    role: user.role,
    iat: Date.now(),
    exp: expToken.getTime(),
  }

  return jwt.sign(payload, JWT_SECRET_KEY)
}

function decodeToken(token) {
  // return jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
  //     if (err) {
  //         return err;
  //     }

  //     return data;
  // });
  return jwt.decode(token, JWT_SECRET_KEY, true)
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  decodeToken,
}
