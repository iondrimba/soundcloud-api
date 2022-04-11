const api = require('./index');

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'accept': 'application/json; charset=utf-8'
};

const params = new URLSearchParams();

const buildParams = () => {
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_ID_SECRET);

  return params;
}

module.exports = () => api.post('/oauth2/token', buildParams(), headers);
