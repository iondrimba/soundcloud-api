const api = require('./index');

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'accept': 'application/json; charset=utf-8'
};

const params = new URLSearchParams();

const buildParams = (refreshToken) => {
  params.append('grant_type', 'refresh_token');
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_ID_SECRET);
  params.append('refresh_token', `${refreshToken}`);

  return params;
}

module.exports = (refreshToken) => api.post('/oauth2/token', buildParams(refreshToken), headers);
