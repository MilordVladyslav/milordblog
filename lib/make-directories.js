const fs = require('fs')
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public')
}
if (!fs.existsSync('./public/users')) {
  fs.mkdirSync('./public/users')
}
if (!fs.existsSync('./public/comments')) {
  fs.mkdirSync('./public/comments')
}
if (!fs.existsSync('./public/messaging')) {
  fs.mkdirSync('./public/messaging')
}
