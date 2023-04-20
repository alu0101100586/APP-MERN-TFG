const jwt = require('./jwt.utils')

function getUserId(req) {
  const token = req.headers.authorization
  const tokenParts = token.replace('Bearer ', '')
  const payload = jwt.decodeToken(tokenParts)
  const { user_id } = payload
  return user_id
}

module.exports = {
  getUserId,
}
