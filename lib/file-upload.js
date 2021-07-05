const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = `./public/user_${req.user.id}`
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder)
    }
    if (req.path === '/update-avatar') {
      destinationFolder += '/photos'
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
      }
    }
    cb(null, destinationFolder)
  },
  filename: (req, file, callback) => {
    // console.log(req)
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err)
      callback(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
let upload = multer({ storage: storage })

module.exports = upload
