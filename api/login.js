const jwt = require('jwt-simple');
const db = require('../mongo/db');
const apiRequests = require('../lib/apiRequests');

const secret = '8srWv7w6ER';
const UserNotFound = { err: 'User not found' };
const ProductNotFound = { err: 'Products not found' };

module.exports = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    fail(res);
  } else {
    login(username, password, res);
  }
};

function fail (res) {
  res.statusMessage = 'Current user/password does not match';
  res.status(400).end();
}

function login (username, password, res) {
  let token;
  let tsec;
  let customerId;

  res.setHeader('Content-Type', 'application/json');

  return apiRequests.getGrantingTicket(username, password)
    .then(response => {
      if (response.code === 200) {
        tsec = response.tsec;
        customerId = response.customerId;
        token = jwt.encode({ customerId }, secret);
        return {
          tsec,
          customerId,
          token
        };
      }
      throw UserNotFound;
    })
    .then(({ customerId, tsec }) => apiRequests.getProductsCustomization(customerId, tsec))
    .then(response => {
      if (response.code === 200) {
        return apiRequests.getEstimatedTransactions(response.products, tsec);
      }
      throw ProductNotFound;
    }).then(response => {
      if (response.estimatedTransactions) {
        saveTransactions(customerId, token, response.estimatedTransactions);
      }
      res.json({ generatedAccessToken: token });
      res.status(200).end();
    }).catch(err => {
      console.log('Error guardando usuario ');
      console.log(JSON.stringify(err));
      fail(res);
    });
}

function saveTransactions (customerId, token, transactions) {
  console.log('Customer id obtenido ' + customerId);
  Promise.all(
    transactions.filter(t => t.forecastedReliability.id === 'T1').map(transaction =>
      (new db.EstimatedTransactions({
        token: token,
        customerId,
        transaction,
        humanConceptName: transaction.humanConceptName,
        dateRange: transaction.dateRange.minimumRangeDate,
        amount: transaction.amount.amount,
        category: transaction.humanCategory.name,
        subcategory: transaction.humanSubcategory.name
      })).save()
    )).then(() => console.log('transactions saved'));
}
