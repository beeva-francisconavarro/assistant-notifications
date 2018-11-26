'use strict';
const db = require('../mongo/db');
const actions = require('./actions');

describe('actions-google/actions', () => {
  const intents = {};
  const appMock = {
    intent: jasmine.createSpy('call')
      .andCallFake((name, fn) => intents[name] = fn)
  };

  beforeEach(() => {
    actions(appMock);
  });

  it('should get Notificaciones Bconomy - yes', function () {
    const conv = {
      user: {
        access: {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.OrcHoIVqEfxrITf56z-LU5f5mnLYVPmN_NrA4IO4Cjw'
        }
      },
      ask: jasmine.createSpy('call')
    };
    intents['Notificaciones Bconomy - yes'](conv);
  });
});
