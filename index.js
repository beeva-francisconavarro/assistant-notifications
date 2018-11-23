// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
//const d=require('date-and-time');
const app=dialogflow({debug : true });
// const {Card, Suggestion} = require('dialogflow-fulfillment');

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


exports.factsAboutGoogle = functions.https.onRequest(app);
//express().use(bodyParser.json(), app).listen(3000);

//v1 --------
// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
//   const agent = new WebhookClient({ request, response });
//   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
//   function welcome(agent) {
//     agent.add(`Welcome to my agent!`);
//   }
 
//   function fallback(agent) {
//     agent.add(`I didn't understand`);
//     agent.add(`I'm sorry, can you try again?`);
// }

//   // Uncomment and edit to make your own intent handler
//   // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
//   // below to get this function to be run when a Dialogflow intent is matched
//   function chisteFunction(agent) {
//     //agent.add(`A mi hijo le hemos puesto gafas`);
//     //agent.add(`Coño. Que nombre más feo. `);
//     let name;
//     try {
//       name = agent.getArgument( 'NOMBRE' );
//     } catch (ex) {
//       console.warn('Error catching name');
//       console.warn(ex);
//     }

//     console.log(name);
//     agent.add(`Santos es subnormal profundo. `);
//     // agent.add(new Card({
//     //     title: `Title: this is a card title`,
//     //     imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
//     //     text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
//     //     buttonText: 'This is a button',
//     //     buttonUrl: 'https://assistant.google.com/'
//     //   })
//     // );
//     // agent.add(new Suggestion(`Quick Reply`));
//     // agent.add(new Suggestion(`Suggestion`));
//     // agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
//   }

//   // Run the proper function handler based on the matched Dialogflow intent name
//   let intentMap = new Map();
//   intentMap.set('Default Welcome Intent', welcome);
//   intentMap.set('Default Fallback Intent', fallback);
//   intentMap.set('chiste', chisteFunction);
//   // intentMap.set('your intent name here', googleAssistantHandler);
//   agent.handleRequest(intentMap);
// });
