const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { API_VERSION, IP_SERVER } = require('./constants');

const app = express();

//Importación de las Rutas
const authRoutes = require('./router/authentication.routes'); 
const userRoutes = require('./router/user.routes');

//Configuración del Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la carpeta uploads
app.use(express.static('uploads'));

// Configuración de CORS
app.use(cors()); // Allow all domains

// Configuración de las rutas
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;