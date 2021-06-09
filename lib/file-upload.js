const multer = require('multer')
const crypto = require('crypto')
const storage = multer.diskStorage({
  destination: 'public',
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err)
      callback(null, file.originalname)
    })
  }
})
let upload = multer({ storage: storage })

module.exports = upload
