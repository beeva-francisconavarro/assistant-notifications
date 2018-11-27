const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
  customerId: String,
  description: String
});

mongoose.model('notifications', notificationSchema);
