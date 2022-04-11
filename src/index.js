const axios = require('axios');

const api = axios.create({
  baseURL: process.env.API_END_POINT,
});

module.exports = api;
