'use strict'
global.ROOT = __dirname

const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const request = require('request')

const { DOMAIN, API_TOKEN } = require('./config')
const apiController = require('./controllers/api')

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 15951

const app = express()
app.locals.ENV = env
app.locals.ENV_DEVELOPMENT = env == 'development'
app.use(logger('dev'))
app.use(bodyParser.json())

/* Setup webhook */
global.API_URL = `https://api.telegram.org/bot${API_TOKEN}`
request.post(`${API_URL}/setWebhook`, {
  form: {
    url: `https://${DOMAIN}/${API_TOKEN}`
  }
}, (err, response, body) => {
  if (err) {
    console.error('[ERROR] Setup webhook', err.stack)
  } else {
    console.log('[INFO] Setup webhook ', body)
  }
})

app.use(`/${API_TOKEN}`, apiController)

app.use((err, req, res, next) => {
  if (err) {
    console.error(error.stack)
    res.status(500).send('Internal error')
  } else {
    res.status(404).send('Not found')
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
