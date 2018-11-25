var query = window.location.href.replace(/.*\?/, '').split('&');
var clientId = 'googlebiconomi';
var params = query.reduce((obj, pair) => {
  var values = pair.split('=');
  obj[values[0]] = values[1];
  return obj;
}, {});

function redirect () {
  if (params.client_id === clientId) {
    const username = $('#username').val();
    const password = $('#password').val();
    $.ajax({
      url: '/login',
      data: JSON.stringify({ username, password }),
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      success: function (result) {
        console.log(result);
        if (result.generatedAccessToken) {
          window.location.href = (params.redirect_uri +
            `#access_token=${result.generatedAccessToken}&token_type=bearer&state=${params.state}`);
        }
      },
      error: function () {
        $('#bloqueError').show();
        setTimeout(function () {
          $('#bloqueError').fadeOut('slow');
        }, 2000);
      }
    });
  }
}
