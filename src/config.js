require('dotenv').config()

export const {
  APP_PORT,
  NODE_ENV,
  DB_HOST
} = process.env

export const IN_PROD = NODE_ENV === 'production'
