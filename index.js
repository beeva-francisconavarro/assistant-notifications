'use strict';
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')
const actions = require('./actions-google/actions');

const app=dialogflow({debug : true });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
let count = 0;
const insultos = 
[' . Vete a zurrir mierdas con látigo.']

app.intent('chiste', (conv, params, signin) => {
  

  

    if (signin.status === "OK") {
      const nombre = conv.parameters['NOMBRE'];
      console.log(conv.parameters);
      conv.close(nombre + insultos[count++]);
      if(count>=insultos.length)
        count = 0;
    } else {
      conv.ask(new actions.SignIn("Necesito hacer login para continuar"));
    }
});

actions(app);


express()
  .use('/actions', bodyParser.json(), app)
  .use('/auth', express.static('auth'))
  .listen(process.env.PORT || 4001);
console.log('Started app');

module.exports = app;
