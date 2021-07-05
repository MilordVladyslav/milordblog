const express = require('express')
const cookieParser = require('cookie-parser')

const apiUsers = require('./api/users')
const apiArticles = require('./api/articles')
const middleware = require('./middleware')
const auth = require('./auth')
const upload = require('./lib/file-upload')
const port = process.env.PORT || 8080
const app = express()
app.use(middleware.cors)
app.use(express.json({ limit: '8192kb' }))
app.use(cookieParser())
app.use(express.static('public'))

app.get('/users-list', auth.ensureUser, apiUsers.usersList)
app.get('/logout', auth.logout)
<<<<<<< HEAD

app.put('/update-user', auth.ensureUser, api.updateUser) //ok
app.put(
  '/update-avatar',
  auth.ensureUser,
  upload.fields([{ name: 'avatar' }]),
  api.updateAvatar
)
app.put('/update-password', auth.authenticate, api.updatePassword)
app.post('/create-user', api.createUser) //ok

=======
app.get('/user/:id', apiUsers.getUser)
app.put('/update-user', auth.ensureUser, apiUsers.updateUser)
app.put(
  '/update-avatar',
  auth.ensureUser,
  upload.fields([{ name: 'avatar_path' }]),
  apiUsers.updateAvatar
)
app.put('/update-password', auth.authenticate, apiUsers.updatePassword)
app.post('/create-user', apiUsers.createUser, auth.authenticate)
>>>>>>> 05f73f483e56511e673c3ae2b66bf2883092ea1f
app.post('/login', auth.authenticate, auth.login)
app.delete('/delete-user', auth.authenticate, apiUsers.deleteUser)

// articles

app.get('/get-article/:id', apiArticles.getArticle)
app.get('/articles-list/:user_id', apiArticles.articlesList)
app.put('/update-article', auth.ensureUser, apiArticles.updateArticle)
app.post(
  '/create-article',
  auth.ensureUser,
<<<<<<< HEAD
  upload.fields([{ name: 'article_files' }]),
  api.createPost
=======
  upload.fields([{ name: 'article_files', maxCount: 100 }]),
  apiArticles.createArticle
>>>>>>> 05f73f483e56511e673c3ae2b66bf2883092ea1f
)
app.delete('/delete-article', auth.ensureUser, apiArticles.deleteArticle)

app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
