// Configure create variables written in .env file to the environment 
require('dotenv').config();
const express = require('express');
// Enable middleware functions
const morgan = require('morgan');
// Enable Cross Origin Resource Sharing
const cors = require('cors');
// 
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const app = express();

// Depends on the condition of the environment
// Morgan - tiny format for production environment
// Morgan - common format for development environment
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// Mounting our midware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, Nghi!')
});

app.use(function errorHandler(error, req, res, next) {
  let response
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } };
   } else {
     console.error(error);
     response = { message: error.message, error };
   }
   res.status(500).json(response);
 });

module.exports = app;