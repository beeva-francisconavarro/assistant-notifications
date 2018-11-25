const responseMapper = require('../lib/responseMapper');
const db = require('../mongo/db');
const moment = require('moment');
const { SignIn } = require('actions-on-google');

module.exports = function (app) {
  let count = 0;
  const frases =
        [', Vete a zurrir mierdas con látigo.', ' no hace tests.'];

  app.intent('chiste', conv => {
    console.log(`sign ` + JSON.stringify(conv.user.access));
    if (getToken(conv)) {
      const nombre = conv.parameters['NOMBRE'];
      console.log(conv.parameters);
      conv.ask(nombre + frases[count++]);
      if (count >= frases.length) {
        count = 0;
      }
    } else {
      conv.ask(new SignIn('Necesito hacer login para continuar'));
    }
  });

  app.intent('Notificaciones Bconomy - yes', conv => {
    const token = getToken(conv);
    if (getToken(conv)) {
      return getMovements(token).then(movements => {
        if (movements.incomes.length || movements.expenses.length) {
          conv.ask('Mejores predicciones de este mes:');
          movements.incomes.forEach(mov => {
            conv.ask(`El próximo día ${moment(mov.dateRange).format('DD')} de ${moment(mov.dateRange).locale('es').format('MMMM')} vas a recibir un ingreso con concepto ${mov.humanConceptName} de unos ${Math.round(mov.amount)} euros aproximadamente`);
          });
          movements.incomes.forEach(mov => {
            conv.ask(`El próximo día ${moment(mov.dateRange).format('DD')} de ${moment(mov.dateRange).locale('es').format('MMMM')} vas a tener un gastos de ${mov.subcategory} con concepto ${mov.humanConceptName} de unos ${Math.round(mov.amount)} euros aproximadamente`);
          });
        } else {
          conv.ask('No tienes ninguna previsión para este mes.');
        }
      });
    } else {
      conv.ask(new SignIn('Necesito hacer login para continuar'));
    }
  });

  app.intent('Notificaciones Bconomy - Repeat', conv => {
    if (getToken(conv)) {

    } else {
      conv.ask(new SignIn('Necesito hacer login para continuar'));
    }

    // let msg = tsec ? 'informado' : 'no informado';
    // console.log('Llamada con customerId: ' + customerId);
    // console.log('Llamada con tsec ' + msg);
    // if (tsec && customerId) {
    //   return apiRequests.getProductsCustomization(customerId, tsec).then(function (response) {
    //     if (response.code === 200) {
    //       let products = response.products;
    //       console.log('Parámetros desde selección de productos obtenidos');
    //       responseMapper.sendGoogleResponse(conv, response.description + ' con resultado: ' + products);
    //     } else {
    //       console.log('Problema al recuperar datos de selección de productos');
    //       responseMapper.sendGoogleResponse(conv, 'Listado de productos: ' + response.description);
    //     }
    //   }).then(function (response) {
    //     if (response.code === 200) {
    //       let products = response.products;
    //       console.log('Parámetros desde selección de productos obtenidos');
    //       return apiRequests.getEstimatedTransactions(products, tsec);
    //     } else {
    //       console.log('Problema al recuperar datos de selección de predicciones');
    //       responseMapper.sendGoogleResponse(conv, 'Listado de predicciones: ' + response.description);
    //     }
    //   }).then(function (response) {
    //     if (response.code === 200) {
    //       console.log('Respuesta de apiRequest de predicciones: ' + JSON.stringify(response));
    //       // Lógica de estimaciones a recuperar (Filtrados)
    //       let allEstimations = response.estimatedTransactions;
    //       console.log('Predicciones obtenidas: ' + JSON.stringify(allEstimations));

    //       let today = new Date();
    //       let currentMonth = today.getMonth();

    //       let bestEstimations = allEstimations.filter(item => {
    //         return item.forecastedReliability.id === 'T1';
    //       }).filter(item => {
    //         return item.movementReliability.name === 'ALTA';
    //       });

    //       console.log('Mejores predicciones: ' + JSON.stringify(bestEstimations));

    //       let currentMonthBestEstimations = bestEstimations.filter(item => {
    //         let estimatedDay = new Date(item.transactionDate);
    //         return estimatedDay.getMonth() === currentMonth;
    //       });

    //       console.log('Mejores predicciones de este mes ' + currentMonth + ': ' + JSON.stringify(currentMonthBestEstimations));

    //       let [entriesEstimations, expensesEstimations] =
    //                     currentMonthBestEstimations.reduce((result, item) => {
    //                       result[item.humanCategory.name === 'Ingresos' ? 0 : 1].push(item);
    //                       return result;
    //                     }, [[], []]);

    //       console.log('Predicciones de ingresos: ' + JSON.stringify(entriesEstimations));
    //       console.log('Predicciones de gastos: ' + JSON.stringify(expensesEstimations));

    //       // Construcción de mensaje de usuario
    //       let responseToUser;
    //       if (entriesEstimations.length > 0) {
    //         let firstEstimation = entriesEstimations[0];
    //         let entryDate = firstEstimation.transactionDate;
    //         let concept = firstEstimation.humanConceptName;
    //         let amount = firstEstimation.amount.amount;

    //         responseToUser = 'El próximo ' + entryDate.toLocaleString('es-ES', { timeZone: 'UTC' }) +
    //                         ' vas a recibir un ingreso con concepto ' + concept.lowerCase() + ' de unos ' + amount + ' euros aproximadamente';
    //       } else {
    //         responseToUser = 'No tienes ninguna previsión para este mes';
    //       }

    //       responseMapper.sendGoogleResponse(conv, responseToUser);
    //     } else {
    //       console.log('Problema al recuperar datos de predicciones');
    //       responseMapper.sendGoogleResponse(conv, 'Listado de predicciones: ' + response.description);
    //     }
    //   });
    // } else {
    //   responseMapper.sendGoogleResponse(conv, 'Faltan parámetros para poder consultar');
    // }
  });
};

function getToken (conv) {
  if (conv.user.access && conv.user.access.token) {
    return conv.user.access.token;
  }
}

function getMovements (token) {
  const month = moment().format('YYYY-MM');
  const today = moment();
  return db.EstimatedTransactions.find({ token: token }).then(response => {
    const movements = response.filter(item => today.isBefore(moment(item.dateRange)));
    return {
      incomes: movements.filter(item => item.category === 'Ingresos'),
      expenses: movements.filter(item => item.category !== 'Ingresos')
    };
  });
}
