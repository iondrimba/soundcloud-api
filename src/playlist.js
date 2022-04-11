const api = require('./index');

const headers = (token) => ({
  'accept': 'application/json; charset=utf-8',
  'Authorization': `OAuth ${token}`
});

module.exports = (token) => api.get(`/playlists/${process.env.PLAYLIST_ID}?show_tracks=true`, { headers: headers(token) });
