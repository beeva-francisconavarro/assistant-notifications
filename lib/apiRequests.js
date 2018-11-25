const request = require('request');
const BASE_URL = process.env.domain;

module.exports = {
  getGrantingTicket: function (username, password) {
    console.log('Llamada a promesa GT');

    const userID = '0019-' + ('00000000' + username.toUpperCase()).slice(-10);

    const options = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      uri: BASE_URL + '/TechArchitecture/grantingTickets/V02',
      body: {
        'authentication': {
          'consumerID': '00000001',
          'authenticationData': [{
            'authenticationData': [password],
            'idAuthenticationData': 'password'
          }
          ],
          'authenticationType': '02',
          'userID': userID
        }
      },
      json: true
    };

    console.log('getGratingTicket - Granting ticket solicitado');

    return new Promise(function (resolve, reject) {
      let finalResponse;
      return request.post(options, function (err, response, body) {
        if (err) {
          console.log('Se produjo un error en la invocación: ' + err);
          finalResponse = {
            'code': 500,
            'description': 'Error en la invocación: ' + err
          };
          reject(finalResponse);
        } else {
          let statusCode = response.statusCode;
          let tsec = response.headers.tsec;
          let user = response.body.user || {};
          let customerId = user.id;
          let description;

          switch (statusCode) {
            case 200: description = 'Invocación con respuesta correcta';
              break;
            case 400: description = 'Invocación inválida. Revisa los parámetros de entrada';
              break;
            case 409: description = 'Invocación con error funcional';
              break;
            case 204: description = 'Invocación sin resultados';
              break;
            case 500: description = 'Invocación con error interno';
              break;
            case 403: description = 'Usuario incorrecto';
              break;
            default: description = 'Invocación con respuesta no reconocida';
          }

          finalResponse = {
            'code': statusCode,
            'description': description,
            'customerId': customerId,
            'tsec': tsec
          };
          resolve(finalResponse);
        }
      });
    });
  },
  getProductsCustomization: function (customerId, tsec) {
    console.log('Llamada a selección de productos');

    const options = {
      headers: {
        'content-type': 'application/json',
        'tsec': tsec
      },
      method: 'GET',
      uri: BASE_URL + '/productCustomization/V01/?customerId=' + customerId,
      json: true
    };

    return new Promise(function (resolve, reject) {
      let finalResponse;
      return request.get(options, function (err, response, body) {
        if (err) {
          console.log('Se produjo un error en la invocación: ' + err);
          finalResponse = {
            'code': 500,
            'description': 'Error en la invocación: ' + err
          };
          reject(finalResponse);
        } else {
          console.log('La respuesta es: ' + JSON.stringify(response));
          let statusCode = response.statusCode;
          let description;
          let visibleProducts;

          switch (statusCode) {
            case 200: description = 'Invocación con respuesta correcta';
              console.log('items' + body.items);
              visibleProducts = body.items.filter(item => {
                return item.visible === true;
              }).map(item => item.contract.id);
              console.log('Productos visibles: ' + visibleProducts);
              break;
            case 400: description = 'Invocación inválida. Revisa los parámetros de entrada';
              break;
            case 409: description = 'Invocación con error funcional';
              break;
            case 204: description = 'Invocación sin resultados';
              break;
            case 500: description = 'Invocación con error interno';
              break;
            default: description = 'Invocación con respuesta no reconocida';
          }

          finalResponse = {
            'code': statusCode,
            'description': description,
            'products': visibleProducts
          };

          console.log('Objeto de salida desde promise: ' + finalResponse);

          resolve(finalResponse);
        }
      });
    });
  },
  getEstimatedTransactions: function (products, tsec) {
    console.log('Llamada a movimientos previstos');

    const options = {
      headers: {
        'content-type': 'application/json',
        'tsec': tsec
      },
      method: 'POST',
      uri: BASE_URL + '/estimatedTransactions/V01/financialManagementView/?paginationKey=0&pageSize=500',
      body: {
        'contractIds': products
      },
      json: true
    };

    return new Promise(function (resolve, reject) {
      let finalResponse;
      return request.post(options, function (err, response, body) {
        if (err) {
          console.log('Se produjo un error en la invocación: ' + err);
          finalResponse = {
            'code': 500,
            'description': 'Error en la invocación: ' + err
          };
          reject(finalResponse);
        } else {
          console.log('La respuesta es: ' + JSON.stringify(response));
          let statusCode = response.statusCode;
          let description;
          let estimatedTransactions;

          switch (statusCode) {
            case 200: description = 'v4 - Invocación con respuesta correcta';
              console.log('items' + body.accountTransactions);
              estimatedTransactions = body.accountTransactions;
              console.log('Movimientos previstos: ' + estimatedTransactions);
              break;
            case 400: description = 'Invocación inválida. Revisa los parámetros de entrada';
              break;
            case 409: description = 'Invocación con error funcional';
              break;
            case 204: description = 'Invocación sin resultados';
              break;
            case 500: description = 'Invocación con error interno';
              break;
            default: description = 'Invocación con respuesta no reconocida';
          }

          finalResponse = {
            'code': statusCode,
            'description': description,
            'estimatedTransactions': estimatedTransactions
          };

          console.log('Objeto de salida desde promise: ' + finalResponse);

          resolve(finalResponse);
        }
      });
    });
  }
};
