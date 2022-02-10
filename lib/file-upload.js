const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = './public/'
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder)
    }

    if (req.path === '/update-avatar') {
      destinationFolder += `users/user_${req.user.id}`
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
      }
      destinationFolder += `/photos`
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
      }
    }
    if (req.path === '/create-article') {
      destinationFolder += `users/user_${req.user.id}`
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
      }
      destinationFolder += `/articles/`
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
      }
    }
    if (req.path === '/create-comment') {
      destinationFolder += `comments/article_${req.body.entity_id}/`
    }
    if (req.path === '/messaging') {
      destinationFolder += `messaging/user_${req.user.id}_user_${req.body.to_id}`
    }
    if (req.path === '/update-message') {
      console.log(req.body)
      destinationFolder = `./public/messaging/user_${req.user.id}_user_${req.body.to_id}`
      const files = fs.readdirSync(destinationFolder)
      console.log(files)
      if (files.length) {
        const index = files.findIndex((item) => item === req.body.image_name)
        if (index > -1) {
          let computedPath = destinationFolder
          computedPath += `/${files[index]}`
          fs.unlinkSync(computedPath)
        }
      }
    }
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder)
    }

    cb(null, destinationFolder)
  },
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err)
      callback(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
let upload = multer({ storage: storage })

module.exports = {
  upload
}
