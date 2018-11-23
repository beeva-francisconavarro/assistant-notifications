const express = require('express');
const app = express();
app.use( express.json() );

app.get('/', (req, res) => processWebhook( req, res ));

app.listen(3000, () => console.log('App listening on port 3000!'));

var processWebhook = function( request, response ){
};