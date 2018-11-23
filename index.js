const express = require('express');
const app = express();
app.use( express.json() );

const server_port = process.env.PORT || 4001;
const server_ip_address = process.env.HOST || '127.0.0.1';

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({foo: 'bar'});
});

app.listen(server_port, server_ip_address, () => {
  console.log('App started on port ' + server_port);
});


// var processWebhook = function( request, response ){
// };