// Configure create variables written in .env file to the environment 
require('dotenv').config();
const express = require('express');
// Enable middleware functions
const morgan = require('morgan');
// Enable Cross Origin Resource Sharing
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const uuid = require('uuid/v4');

const app = express();

// Depends on the condition of the environment
// Morgan - tiny format for production environment
// Morgan - common format for development environment
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// Mounting our midware
app.use(morgan(morganOption));
app.use(express.json());
app.use(helmet());
app.use(cors());

// Creates global variable
let addresses = [
  {
    id: 1234,
    firstName: 'nghi',
    lastName: 'tran',
    address1: '8383 w augusta',
    address2: '',
    city: 'phoenix',
    state: 'az',
    zip: 85051
  },
  {
    id: 5678,
    firstName: 'tom',
    lastName: 'smith',
    address1: '2927 flora vista ave',
    address2: 'apt 1092',
    city: 'sunnyvale',
    state: 'ca',
    zip: 95203
  }
];

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

 // Fetches all addresses
app.get('/address', (req, res) => {
  res.status(200).send(addresses);
});

// Creates new address
app.post('/address', (req, res) => {
  const { firstName, lastName, address1, address2='', city, state, zip } = req.body;

  // Validates data
  if(!firstName || !lastName || !address1 || !city || !state || !zip) {
    return res.status(400).send('One of the following data is not provided: first name, last name, address, city, state, zip');
  }
  if(state.length !== 2) {
    return res.status(400).send('State has to be 2 characters.');
  }
  if(isNaN(zip)) {
    return res.status(400).send('Zip code can only be numerical');
  }
  if(zip.toString().length !== 5) {
    return res.status(400).send('Zip code has to have 5 digit');
  }

  // Creates address
  const id = uuid();
  const newAddress = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };

  // Inserts address
  addresses.push(newAddress);
  
  // Sends reponse
  res.status(201).send(newAddress);
});

// Deletes address
app.delete('/address/:userId', (req, res) => {
  const {userId} = req.params;
  
  // Find user
  const index = addresses.findIndex(a => a.id === Number(userId));
  console.log('id:', userId, 'index', index);
  // Returns error if user is not found
  if(index === -1) {
    return res.status(404).send('User not found.');
  }
  // Removes 1 address at the specified index
  addresses.splice(index,1);
  res.status(204).end();
});

module.exports = app;