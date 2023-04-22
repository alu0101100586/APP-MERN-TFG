const moongose = require('mongoose')
const app = require('./app')

const {
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
  API_VERSION,
  IP_SERVER,
} = require('./constants')

const PORT = process.env.PORT || 3977

moongose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`)
  .then(() => {
    app.listen(PORT, () => {
      console.log('------------------------------------')
      console.log('---------- Music API ---------------')
      console.log('------------------------------------')
      console.log(
        `Server running on http://${IP_SERVER}:${PORT}/api/${API_VERSION}`
      )
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error)
  })
