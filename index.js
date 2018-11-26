'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { dialogflow } = require('actions-on-google');
const actions = require('./actions-google/actions');
const login = require('./api/login');
const notifications = require('./api/notifications');

const app = dialogflow({ debug: true });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

actions(app);

express()
  .use('/actions', bodyParser.json(), app)
  .use('/auth', express.static('oauth'))
  .use('/login', bodyParser.json(), login)
  .use('/notifications', bodyParser.json(), notifications)
  .listen(process.env.PORT || 4001);
console.log('Started app');

module.exports = app;
