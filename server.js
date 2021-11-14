const express = require('express')
const cookieParser = require('cookie-parser')

const {
  apiUsers,
  apiArticles,
  apiComments,
  apiConnections,
  apiMessaging
} = require('./api')
const middleware = require('./middleware')
const auth = require('./auth')
const { upload } = require('./lib/file-upload')
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
app.put(
  '/update-avatar',
  auth.ensureUser,
  upload.fields([{ name: 'avatar_path' }]),
  apiUsers.updateAvatar
)
app.put('/update-password', auth.authenticate, apiUsers.updatePassword)
app.post('/create-user', apiUsers.createUser, auth.authenticate)
app.post('/login', auth.authenticate, auth.login)
app.delete('/delete-user', auth.authenticate, apiUsers.deleteUser)

// articles

app.get('/get-article/:id', apiArticles.getArticle)
app.get('/articles-list/:user_id', apiArticles.articlesList)
app.put('/update-article', auth.ensureUser, apiArticles.updateArticle)
app.post(
  '/create-article',
  auth.ensureUser,
  upload.fields([{ name: 'article_files', maxCount: 100 }]),
  apiArticles.createArticle
)
app.delete('/delete-article', auth.ensureUser, apiArticles.deleteArticle)

//comment

app.post(
  '/create-comment/',
  auth.ensureUser,
  upload.fields([{ name: 'comment_attachments', maxCount: 8 }]),
  apiComments.createComment
)

app.get('/get-comment/:id', apiComments.getComment)
app.get('/comments-list/:entity_id', apiComments.getCommentsList)
app.put('/update-comment/', apiComments.updateComment)
app.delete('/delete-comment/', apiComments.deleteComment)

app.post('/connections', auth.ensureUser, apiConnections.create)
app.put('/connections', auth.ensureUser, apiConnections.update)
app.get('/connections', auth.ensureUser, apiConnections.read)
app.delete('/connections', auth.ensureUser, apiConnections.del)

app.post('/get-messages', auth.ensureUser, apiMessaging.getMessages)

app.post(
  '/messaging',
  auth.ensureUser,
  upload.fields([{ name: 'file_attachments', maxCount: 8 }]),
  apiMessaging.createMessage
)

app.put(
  '/update-message',
  auth.ensureUser,
  upload.fields([{ name: 'file_attachments', maxCount: 8 }]),
  apiMessaging.updateMessage
)

app.delete('/delete-message', auth.ensureUser, apiMessaging.deleteMessage)

app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
