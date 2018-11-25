const mongoose = require('mongoose');
const connectionString = process.env.mongo;
mongoose.Promise = Promise;

require('./models/estimatedTransactions');

console.log('Connection to mongodb://' + connectionString);
mongoose.connect('mongodb://' + connectionString);

module.exports = {
  estimatedTransactions: mongoose.model('estimatedTransactions')
};
