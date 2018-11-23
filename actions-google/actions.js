const responseMapper = require('./lib/responseMapper');
const apiRequests = require('./lib/apiRequests');
const config = require('./config/config');

module.exports = function (app) {

    let userId;
    let customerId;
    let tsec;

    //********************************************

    console.log('Adding intents');


    app.intent('NotificacionesBconomy.NotificacionesBconomy-yes', conv => {
        console.log('Llamada a intent Granting ticket');

        return apiRequests.getGrantingTicket()
            .then( function (response) {
                if (response.code === 200) {
                    tsec = response.tsec;
                    customerId = response.customerId;
                    console.log('Parámetros desde ticket obtenidos');
                    return apiRequests.getProductsCustomization(customerId, tsec);
                } else {
                    console.log('Problema al recuperar datos de ticket');
                    responseMapper.sendGoogleResponse(conv, 'Obtención de tickets: ' + response.description);
                }
            }).then( function (response) {
                if (response.code === 200) {
                    let products = response.products;
                    console.log('Parámetros desde selección de productos obtenidos');
                    return apiRequests.getEstimatedTransactions(products, tsec);
                } else {
                    console.log('Problema al recuperar datos de selección de predicciones');
                    responseMapper.sendGoogleResponse(conv, 'Listado de predicciones: ' + response.description);
            }}).then( function (response) {
                if (response.code === 200) {
                    console.log('Respuesta de apiRequest de predicciones: ' + JSON.stringify(response));
                    //Lógica de estimaciones a recuperar (Filtrados)
                    let allEstimations = response.estimatedTransactions;
                    console.log('Predicciones obtenidas: ' + JSON.stringify(allEstimations));

                    let today = new Date();
                    let currentMonth = today.getMonth();

                    let bestEstimations = allEstimations.filter(item => {
                        return item.forecastedReliability.id === 'T1'
                    }).filter(item => {
                        return item.movementReliability.name === 'ALTA'
                    });

                    console.log('Mejores predicciones: ' + JSON.stringify(bestEstimations));

                    let currentMonthBestEstimations = bestEstimations.filter(item => {
                        let estimatedDay = new Date(item.transactionDate);
                        return estimatedDay.getMonth() === currentMonth;
                    });

                    console.log('Mejores predicciones de este mes ' + currentMonth + ': ' + JSON.stringify(currentMonthBestEstimations));

                    let [entriesEstimations, expensesEstimations] =
                        currentMonthBestEstimations.reduce((result, item) => {
                            result[item.humanCategory.name === 'Ingresos'? 0:1].push(item);
                            return result;
                        }, [[], []]);

                    console.log('Predicciones de ingresos: ' + JSON.stringify(entriesEstimations));
                    console.log('Predicciones de gastos: ' + JSON.stringify(expensesEstimations));

                    //Construcción de mensaje de usuario
                    let responseToUser;
                    if(entriesEstimations.length > 0) {
                        let firstEstimation = entriesEstimations[0];
                        let entryDate = firstEstimation.transactionDate;
                        let concept = firstEstimation.humanConceptName;
                        let amount = firstEstimation.amount.amount;

                        responseToUser = 'El próximo ' + entryDate.toLocaleString('es-ES', { timeZone: 'UTC' }) +
                            ' vas a recibir un ingreso con concepto ' + concept.lowerCase() + ' de unos ' + amount + ' euros aproximadamente';
                    } else {
                        responseToUser = 'No tienes ninguna previsión para este mes';
                    }

                    responseMapper.sendGoogleResponse(conv, responseToUser);
                } else {
                    console.log('Problema al recuperar datos de predicciones');
                    responseMapper.sendGoogleResponse(conv, 'Listado de predicciones: ' + response.description);
            }});

    });

    app.intent('Notificaciones Bconomy - Repeat', conv => {
        console.log('Llamada a intent repeat');

        let msg = tsec?'informado':'no informado';
        console.log('Llamada con customerId: ' + customerId);
        console.log('Llamada con tsec ' + msg);
        if(tsec && customerId) {
            return apiRequests.getProductsCustomization(customerId, tsec).then(function (response) {
                if (response.code === 200) {
                    let products = response.products;
                    console.log('Parámetros desde selección de productos obtenidos');
                    responseMapper.sendGoogleResponse(conv, response.description + ' con resultado: ' + products);
                } else {
                    console.log('Problema al recuperar datos de selección de productos');
                    responseMapper.sendGoogleResponse(conv, 'Listado de productos: ' + response.description);
                }
            }).then( function (response) {
                if (response.code === 200) {
                    let products = response.products;
                    console.log('Parámetros desde selección de productos obtenidos');
                    return apiRequests.getEstimatedTransactions(products, tsec);
                } else {
                    console.log('Problema al recuperar datos de selección de predicciones');
                    responseMapper.sendGoogleResponse(conv, 'Listado de predicciones: ' + response.description);
                }}).then( function (response) {
                if (response.code === 200) {
                    console.log('Respuesta de apiRequest de predicciones: ' + JSON.stringify(response));
                    //Lógica de estimaciones a recuperar (Filtrados)
                    let allEstimations = response.estimatedTransactions;
                    console.log('Predicciones obtenidas: ' + JSON.stringify(allEstimations));

                    let today = new Date();
                    let currentMonth = today.getMonth();

                    let bestEstimations = allEstimations.filter(item => {
                        return item.forecastedReliability.id === 'T1'
                    }).filter(item => {
                        return item.movementReliability.name === 'ALTA'
                    });

                    console.log('Mejores predicciones: ' + JSON.stringify(bestEstimations));

                    let currentMonthBestEstimations = bestEstimations.filter(item => {
                        let estimatedDay = new Date(item.transactionDate);
                        return estimatedDay.getMonth() === currentMonth;
                    });

                    console.log('Mejores predicciones de este mes ' + currentMonth + ': ' + JSON.stringify(currentMonthBestEstimations));

                    let [entriesEstimations, expensesEstimations] =
                        currentMonthBestEstimations.reduce((result, item) => {
                            result[item.humanCategory.name === 'Ingresos'? 0:1].push(item);
                            return result;
                        }, [[], []]);

                    console.log('Predicciones de ingresos: ' + JSON.stringify(entriesEstimations));
                    console.log('Predicciones de gastos: ' + JSON.stringify(expensesEstimations));

                    //Construcción de mensaje de usuario
                    let responseToUser;
                    if(entriesEstimations.length > 0) {
                        let firstEstimation = entriesEstimations[0];
                        let entryDate = firstEstimation.transactionDate;
                        let concept = firstEstimation.humanConceptName;
                        let amount = firstEstimation.amount.amount;

                        responseToUser = 'El próximo ' + entryDate.toLocaleString('es-ES', { timeZone: 'UTC' }) +
                            ' vas a recibir un ingreso con concepto ' + concept.lowerCase() + ' de unos ' + amount + ' euros aproximadamente';
                    } else {
                        responseToUser = 'No tienes ninguna previsión para este mes';
                    }

                    responseMapper.sendGoogleResponse(conv, responseToUser);
                } else {
                    console.log('Problema al recuperar datos de predicciones');
                    responseMapper.sendGoogleResponse(conv, 'Listado de predicciones: ' + response.description);
                }});
        } else {
            responseMapper.sendGoogleResponse(conv, 'Faltan parámetros para poder consultar');
        }

    });
}
