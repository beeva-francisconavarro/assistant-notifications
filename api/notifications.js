const db = require('../mongo/db');

module.exports = (req, res) => {
  const notification = req.body || {};

  if (!notification.description) {
    fail(res);
  } else {
    addNotification(notification).then(() => {
      res.json({ msg: 'saved' })
        .status(400)
        .end();
    }).catch(() => fail(res));
  }
};

function addNotification (notification) {
  return (new db.Notification({
    customerId: notification.customerId,
    description: notification.description
  })).save();
}

function fail (res) {
  res.statusMessage = 'Incorrect input data';
  res.status(400).end();
}
