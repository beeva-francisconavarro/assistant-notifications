'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { dialogflow } = require('actions-on-google');
const actions = require('./actions-google/actions');

const app=dialogflow({debug : false });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


actions(app);


express()
  .use('/actions', bodyParser.json(), app)
  .use('/auth', express.static('oauth'))
  .use('/login', express.static('login'))
  .listen(process.env.PORT || 4001);
console.log('Started app');

module.exports = app;
