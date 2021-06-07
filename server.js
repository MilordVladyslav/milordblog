const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const api = require('./api')
const middleware = require('./middleware')
const auth = require('./auth')
const multer = require('multer')
const port = process.env.PORT || 8080
const crypto = require('crypto')
const path = require('path')
const app = express()

app.use(middleware.cors)
app.use(express.json({ limit: '8192kb' }))
app.use(cookieParser())
app.use(express.static('public'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('rthmkrthkmrth')
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage }).single('demo_image')
app.post('/image', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send('Something went wrong!')
    }
    res.send(req.body.file)
  })
})

app.get('/users-list', auth.ensureUser, api.usersList)
app.get('/logout', auth.logout)
app.put('/update-username', auth.authenticate, api.updateUsername)
app.put('/update-password', auth.authenticate, api.updatePassword)
app.post('/users', api.createUser)
app.post('/login', auth.authenticate, auth.login)
app.delete('/delete-user', auth.authenticate, api.deleteUser)

app.post('/create-post', auth.ensureUser, api.createPost)
app.get('/get-post', api.getPost)
app.get('/posts-list', api.postsList)
app.put('/update-post', auth.ensureUser, api.updatePost)
app.delete('/delete-post', auth.ensureUser, api.deletePost)
app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
