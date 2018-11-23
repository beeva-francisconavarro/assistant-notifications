'use strict';
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')

const app=dialogflow({debug : true });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
let count = 0;
const insultos = 
[' es retrasao profundo', ' es un pelahuevos', ' . Vete a zurrir mierdas con látigo.', ' es un bajapieles']

app.intent('chiste', conv => {
  //console.log('intent chiste');
  const nombre = conv.parameters['NOMBRE'];
  console.log(conv.parameters);
  conv.close(nombre + insultos[count++]);
  if(count>=insultos.length)
    count = 0;
});

express().use(bodyParser.json(), app).listen(process.env.PORT || 4001);
console.log('Started app');

module.exports = app;
