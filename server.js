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
app.get('/user/:id', apiUsers.getUser)
app.put('/update-user', auth.ensureUser, apiUsers.updateUser)
app.put('/update-avatar', auth.ensureUser)
app.put('/update-password', auth.authenticate, apiUsers.updatePassword)
app.post('/create-user', apiUsers.createUser, auth.authenticate)
app.post('/login', auth.authenticate, auth.login)
app.delete('/delete-user', auth.authenticate, apiUsers.deleteUser)

app.get('/get-article', apiArticles.getArticle)
app.get('/articles-list', apiArticles.articlesList)
app.put('/update-article', auth.ensureUser, apiArticles.updateArticle)
app.post(
  '/create-article',
  auth.ensureUser,
  upload.fields([{ name: 'article_files', maxCount: 100 }]),
  apiArticles.createArticle
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
