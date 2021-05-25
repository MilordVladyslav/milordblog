const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const api = require('./api')
const middleware = require('./middleware')
const auth = require('./auth')
const port = process.env.PORT || 8080

const app = express()

app.use(middleware.cors)
app.use(express.json())
app.use(cookieParser())

app.post('/users', api.createUser)
app.post('/login', auth.authenticate, auth.login)
app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
