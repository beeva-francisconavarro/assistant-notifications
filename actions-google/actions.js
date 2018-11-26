const db = require('../mongo/db');
const moment = require('moment');
const { SignIn, Suggestions } = require('actions-on-google');

module.exports = function (app) {
  const suggestions = new Suggestions([
    'ver más',
    'resumen'
  ]);

  app.intent('movimientos-previstos', conv => {
    const token = getToken(conv);
    if (getToken(conv)) {
      return getMovements(token).then(movements => {
        if (movements.length) {
          const mov = movements[conv.data.count++];
          conv.ask(`El próximo día ${moment(mov.dateRange).format('DD')} de ${moment(mov.dateRange).locale('es').format('MMMM')} vas a recibir un ingreso con concepto ${mov.humanConceptName} de unos ${Math.round(mov.amount)} euros aproximadamente. ` +
           '¿Deseas ver más movimientos o un resumen?');
          conv.ask(suggestions);
        } else {
          conv.ask('No tienes ninguna previsión para este mes.');
        }
      });
    } else {
      conv.ask(new SignIn('Necesito hacer login para continuar'));
    }
  });

  app.intent('movimientos-previstos - ver mas', conv => {
    const token = getToken(conv);
    if (getToken(conv)) {
      return getMovements(token).then(movements => {
        if (movements.length) {
          const mov = movements[1];
          conv.ask(
            `El próximo día ${moment(mov.dateRange).format('DD')} de ${moment(mov.dateRange).locale('es').format('MMMM')} vas a recibir un ingreso con concepto ${mov.humanConceptName} de unos ${Math.round(mov.amount)} euros aproximadamente. ` +
            '¿Deseas ver más movimientos o un resumen?'
          );
          conv.ask(suggestions);
        } else {
          conv.ask('No tienes ninguna previsión para este mes.');
        }
      });
    } else {
      conv.ask(new SignIn('Necesito hacer login para continuar'));
    }
  });

  app.intent('movimientos-previstos - resumen', conv => {
    const token = getToken(conv);
    if (getToken(conv)) {
      return getMovements(token).then(movements => {
        if (movements.length) {
          conv.close(`En resumen tienes ${movements.length} movimientos próximos para este mes.`);
        } else {
          conv.ask('No tienes ninguna previsión para este mes.');
        }
      });
    } else {
      conv.ask(new SignIn('Necesito hacer login para continuar'));
    }
  });
};
function getToken (conv) {
  if (conv.user.access && conv.user.access.token) {
    return conv.user.access.token;
  }
}

function getMovements (token) {
  const today = moment();
  return db.EstimatedTransactions.find({ token: token }).then(response =>
    response.filter(item => today.isBefore(moment(item.dateRange)))
  );
}
