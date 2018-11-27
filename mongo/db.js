const mongoose = require('mongoose');
const connectionString = process.env.mongo;
mongoose.Promise = global.Promise;

require('./models/estimatedTransactions');
require('./models/notifications');

console.log('Connection to ' + connectionString);
mongoose.connect(connectionString)
  .then(() => console.log('Connected!'))
  .catch(err => console.warn('Error connecting ' + JSON.stringify(err)));

module.exports = {
  EstimatedTransactions: mongoose.model('estimatedTransactions'),
  Notification: mongoose.model('notifications')
};
