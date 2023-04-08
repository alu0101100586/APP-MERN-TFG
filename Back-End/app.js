const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { API_VERSION, IP_SERVER } = require('./constants');

const app = express();

//Import routes
const authRoutes = require('./router/authentication'); 
const userRoutes = require('./router/user');

//CONFIGURE BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure static folder
app.use(express.static('uploads'));

// Configure Headers HTTP - CORS
app.use(cors()); // Allow all domains

// Configure Routes
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;