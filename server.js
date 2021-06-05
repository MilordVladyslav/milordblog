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

app.get('/users-list', auth.ensureUser, api.usersList)
app.get('/logout', auth.logout)
app.put('/update-username', auth.authenticate, api.updateUsername)
app.put('/update-password', auth.authenticate, api.updatePassword)
app.post('/users', api.createUser)
app.post('/login', auth.authenticate, auth.login)
app.delete('/delete-user', auth.authenticate, api.deleteUser)

// app.get('/posts-list', api.postsList)
// app.get('/post:id', api.getPost)
app.post('/create-post', auth.ensureUser, api.createPost)
app.get('/get-post', api.getPost)
app.get('/posts-list', api.postsList)
// app.put('/update-post', auth.ensureUser, api.updatePost)

app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
