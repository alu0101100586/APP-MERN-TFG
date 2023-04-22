const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { API_VERSION } = require('./constants')

const app = express()

//Importación de las Rutas
const authRoutes = require('./router/authentication.routes')
const userRoutes = require('./router/user.routes')
const newsletterRoutes = require('./router/newsletter.routes')
const artistRoutes = require('./router/artist.routes')
const discRoutes = require('./router/disc.routes')
const concertRoutes = require('./router/concert.routes')
const merchandiseRoutes = require('./router/merchandise.routes')

//Configuración del Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configuración de la carpeta uploads
app.use(express.static('uploads'))

// Configuración de CORS
app.use(cors()) // Allow all domains

// Configuración de las rutas
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(`/api/${API_VERSION}`, newsletterRoutes)
app.use(`/api/${API_VERSION}`, artistRoutes)
app.use(`/api/${API_VERSION}`, discRoutes)
app.use(`/api/${API_VERSION}`, concertRoutes)
app.use(`/api/${API_VERSION}`, merchandiseRoutes)

module.exports = app
