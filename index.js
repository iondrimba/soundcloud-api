require('dotenv').config();

const NodeCache = require('node-cache');
const fastify = require('fastify');
const auth = require('./src/auth');
const playlist = require('./src/playlist');
const stream = require("./src/stream");
const ttl = 3600; // 1 hour
const localCache = new NodeCache();

const app = fastify({ logger: true });

app.register(require('@fastify/cors'), {
  origin: (origin, cb) => {
    if (/https\:\/\/playlist\.iondrimbafilho.me/.test(origin)) {
      cb(null, true);

      return;
    }

    cb(new Error("Not allowed"));
  }
})

async function authenticate() {
  if (!localCache.get('auth')) {
    const result = await auth();

    localCache.set('auth', result.data, ttl);
  }
}

app.get('/api/stream/:trackid', async (request) => {
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
    if (!localCache.get('tracks')) {
      const resultPlaylist = await playlist(localCache.get('auth').access_token);

      localCache.set('tracks', resultPlaylist.data.tracks, ttl);
    }

    return localCache.get('tracks');
  } catch (error) {
    app.log.error('playlist error');
  }
})

app.get('/', async () => {
  return { status: 200 };
})

const start = () => {
  app.addHook('preHandler', async (request) => {
    try {
      await authenticate();
    } catch (error) {
      throw new Error(error);
    }

    return
  })


  app.listen(process.env.PORT || 3001, '0.0.0.0')
    .catch(err => app.log.error(err));
}

start();
