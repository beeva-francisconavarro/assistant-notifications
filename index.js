'use strict';
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow, SignIn } = require('actions-on-google')
const actions = require('./actions-google/actions');

const app=dialogflow({debug : false });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
let count = 0;
const insultos = 
[' . Vete a zurrir mierdas con látigo.']


app.intent('chiste', conv => {

    console.log(`sign ` + JSON.stringify(conv.user.access));
    if (conv.user.access && conv.user.access.token && conv.user.access.token.length) {
      const nombre = conv.parameters['NOMBRE'];
      console.log(conv.parameters);
      conv.ask(nombre + insultos[count++]);
      if(count>=insultos.length)
        count = 0;
    } else {
      //conv.ask(new actions.SignIn("Necesito hacer login para continuar"));
      app.askForSignIn();
    }
});

actions(app);


express()
  .use('/actions', bodyParser.json(), app)
  .use('/auth', express.static('auth'))
  .listen(process.env.PORT || 4001);
console.log('Started app');

module.exports = app;
