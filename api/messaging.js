const autoCatch = require('../lib/auto-catch')
const Messaging = require('../models/messaging')
const existedFields = require('../utils/existedFields')
const fs = require('fs')
module.exports = autoCatch({
  createMessage,
  updateMessage,
  getMessages,
  deleteMessage
})

async function createMessage(req, res) {
  req.body.from_id = req.user.id
  const errors = existedFields(req.body, ['from_id', 'to_id', 'message'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  const { file_attachments = [] } = req.files || {}
  if (file_attachments.length > 0) {
    const host = req.get('host')
    let messageFilesLinks = []
    for (let i = 0; i < file_attachments.length; i++) {
      messageFilesLinks.push(
        req.protocol + '://' + host + '/' + file_attachments[i].path
      )
    }
    req.body.attachments = [...messageFilesLinks]
  }
  if (!req.body.attachments.length && !req.body.message) {
    res.status(400).json({ errors: ['message or file attachment is required'] })
  }
  const messages = await Messaging.createMessage(req.body)
  res.status(200).json(messages)
}

async function updateMessage(req, res) {
  req.body.from_id = req.user.id
  const errors = existedFields(req.body, ['from_id', 'to_id'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }

  const { file_attachments = [] } = req.files || {}
  if (file_attachments.length > 0) {
    const host = req.get('host')
    let messageFilesLinks = []
    for (let i = 0; i < file_attachments.length; i++) {
      messageFilesLinks.push(
        req.protocol + '://' + host + '/' + file_attachments[i].path
      )
    }
    req.body.attachments = [...messageFilesLinks]
  }
  if (!req.body.attachments.length && !req.body.message) {
    res.status(400).json({ errors: ['message or file attachment is required'] })
  }
  const messages = await Messaging.updateMessage(req.body)
  res.status(200).json(messages)
}

async function getMessages(req, res) {
  req.body.from_id = req.user.id
  const errors = existedFields(req.body, ['to_id'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  const messages = await Messaging.getMessages(req.body)
  res.status(200).json(messages)
}

async function deleteMessage(req, res) {
  req.body.from_id = req.user.id
  const errors = existedFields(req.body, ['from_id', 'to_id'])
  if (errors.length) {
    req.status(400).json({ errors: errors })
  }
  let dirPath = `./public/messaging/user_${req.body.from_id}_user_${req.body.to_id}`
  const dirFiles = fs.readdirSync(dirPath)
  for (let i = 0; dirFiles.length; i++) {
    fs.unlinkSync(dirPath + `/${dirFiles[i]}`)
  }
  const messages = await Messaging.deleteMessage(req.body)
  res.status(200).json(messages)
}
