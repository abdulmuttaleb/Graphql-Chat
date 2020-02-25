require('dotenv').config()

export const {
  APP_PORT,
  NODE_ENV,
  DB_HOST,

  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!secret!',
  SESS_LIFETIME = 7200000, // session age is 2 hours

  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASS = 'secret'
} = process.env

export const IN_PROD = NODE_ENV === 'production'
