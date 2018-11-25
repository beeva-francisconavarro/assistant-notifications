const mongoose = require('mongoose');

var estimatedTransactionsSchema = new mongoose.Schema({
  token: String,
  customerId: String,
  humanConceptName: String,
  amount: Number,
  dateRange: String,
  category: String,
  subcategory: String
});

mongoose.model('estimatedTransactions', estimatedTransactionsSchema);
