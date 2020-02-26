import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import redis from 'redis'
import session from 'express-session'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { APP_PORT, IN_PROD, DB_HOST, SESS_NAME, SESS_SECRET, SESS_LIFETIME, REDIS_HOST, REDIS_PORT, REDIS_PASS } from './config'
import mongoose from 'mongoose'
import schemaDirectives from './directives'

(async () => {
  try {
    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const app = express()

    app.disable('x-powered-by')

    // init redis store
    const RedisStore = require('connect-redis')(session)
    const redisClient = redis.createClient({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASS
    })

    const store = new RedisStore({
      client: redisClient
    })
    // init express session here
    app.use(session({
      store,
      name: SESS_NAME,
      secret: SESS_SECRET,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        expires: parseInt(SESS_LIFETIME),
        maxAge: parseInt(SESS_LIFETIME),
        sameSite: true,
        secure: IN_PROD
      }
    }))

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      cors: false,
      playground: IN_PROD ? false : {
        settings: {
          'request.credentials': 'include'
        }
      },
      context: ({ req, res }) => ({ req, res })
    })
    server.applyMiddleware({ app, cors: false }) // app is from an existing express app

    app.listen({ port: APP_PORT }, () => {
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    })
  } catch (e) {
    console.error(e)
  }
})()
