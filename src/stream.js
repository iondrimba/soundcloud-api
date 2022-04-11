const api = require('./index');

const headers = (token) => ({
  'accept': 'application/json; charset=utf-8',
  'Authorization': `OAuth ${token}`
});

module.exports = {
  requestTrack: (token, trackId) => api.get(`/tracks/${trackId}`, { headers: headers(token) }),
  streamTrack: (token, trackId) => api.get(`/tracks/${trackId}/streams`, { headers: headers(token) })
};
