const jwt = require('jwt-simple');
const db = require('../mongo/db');
const secret = '8srWv7w6ER';

module.exports = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(db);
  console.log(password);
  var token = jwt.encode({ username }, secret);
  res.setHeader('Content-Type', 'application/json');
  res.json({ generatedAccessToken: token });
};
