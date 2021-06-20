const express = require('express')
const cookieParser = require('cookie-parser')

const api = require('./api')
const middleware = require('./middleware')
const auth = require('./auth')
const upload = require('./lib/file-upload')
const port = process.env.PORT || 8080
const app = express()
app.use(middleware.cors)
app.use(express.json({ limit: '8192kb' }))
app.use(cookieParser())
app.use(express.static('public'))

app.get('/users-list', auth.ensureUser, api.usersList)
app.get('/logout', auth.logout)
app.put('/update-username', auth.authenticate, api.updateUsername)
app.put('/update-password', auth.authenticate, api.updatePassword)
app.article('/users', api.createUser)
app.article('/login', auth.authenticate, auth.login)
app.delete('/delete-user', auth.authenticate, api.deleteUser)

app.article(
  '/create-article',
  auth.ensureUser,
  upload.fields([{ name: 'article_files', maxCount: 100 }]),
  api.createPost
)
app.get('/get-article', api.getPost)
app.get('/articles-list', api.postsList)
app.put('/update-article', auth.ensureUser, api.updatePost)
app.delete('/delete-article', auth.ensureUser, api.deletePost)
app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
