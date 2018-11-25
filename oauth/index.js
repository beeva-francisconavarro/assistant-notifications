var query = window.location.href.replace(/.*\?/, '').split('&');

var params = query.reduce((obj, pair) => {
  var values = pair.split('=');
  obj[values[0]] = values[1];
  return obj;
}, {});

function redirect() {
  var generatedACCESS_TOKEN = '12345';
  if (params.client_id = 'googlebiconomi') {
    window.location = params.redirect_uri +
      `#access_token=${generatedACCESS_TOKEN}&token_type=bearer&state=${params.state}`
  }
}