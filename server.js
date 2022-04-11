require('dotenv').config();

const NodeCache = require('node-cache');
const fastify = require('fastify');
const cors = require('fastify-cors');

const auth = require('./src/auth');
const playlist = require('./src/playlist');
const stream = require("./src/stream");
const ttl = 3600; // 1 hour
const localCache = new NodeCache();

const app = fastify({ logger: true });

app.register(cors, {});

async function authenticate() {
  if (!localCache.get('auth')) {
    const result = await auth();

    localCache.set('auth', result.data, ttl);
  }
}

app.get('/api/stream/:trackid', async (request) => {
  try {
    await authenticate();
  } catch (error) {
    app.log.error('/api/stream:auth error', error);
  }

  try {
    const token = localCache.get('auth');

    await stream.requestTrack(token.access_token, request.params.trackid);

    const streamTrack = await stream.streamTrack(token.access_token, request.params.trackid);

    return streamTrack.data;
  } catch (error) {
    app.log.error('/api/stream:stream error');
  }
})

app.get('/api', async () => {
  try {
    await authenticate();
  } catch (error) {
    app.log.error('/api:auth error', error);
  }

  try {
    const resultPlaylist = await playlist(localCache.get('auth').access_token);

    return resultPlaylist.data.tracks;
  } catch (error) {
    app.log.error('playlist error');
  }
})

const start = async () => {
  try {
    await app.listen(process.env.PORT || 3001);
  } catch (err) {
    app.log.error(err);

    process.exit(1);
  }
}

start();
