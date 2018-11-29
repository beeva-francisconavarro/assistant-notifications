# Bconomy with google actions

  

Aplicación para controlar la temperatura a través de la Raspberry Pi

  

[![node](https://img.shields.io/badge/node-10.x-brightgreen.svg)]()

## Server configuration
  
### Install dependencies:
```bash

$ npm install

```
  

### Run tests with jasmine:

  

```bash

$ npm test

```

  

### Configure variables to deploy:

  

There are some variables to configure before run server:

  

 - **domain** : url domain to multichannel services. In production "https://www.bbva.es/ASO/"
 - **mongo** : conecction string to mongo database mongodb://usr:pwd@host:port/database
 - **PORT** : port to deploy express

  

### Start server local:

  

```bash

$ npm start

```

## Dialogflow configuration

To configure you have to enable "Fulfillment". Go to dialogflow console and section Fulfillment. Enable it and put the URL of your server.

![Fulltilment configuration](https://snag.gy/3ocQNs.jpg)

