const mongoose = require('mongoose');

var estimatedTransactions = new mongoose.Schema({
  token: String,
  amount: Number,
  date: Date
});

mongoose.model('estimatedTransactions', estimatedTransactions);
