const mongoose = require('mongoose');

var estimatedTransactionsSchema = new mongoose.Schema({
  token: String,
  amount: Number,
  date: Date
});

mongoose.model('estimatedTransactions', estimatedTransactionsSchema);
