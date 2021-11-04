const autoCatch = require('../lib/auto-catch')
const Messaging = require('../models/messaging')
const existedFields = require('../utils/existedFields')

module.exports = autoCatch({
  createMessage
})

async function createMessage(req, res) {
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
  console.log(req.body)
  const messages = Messaging.createMessage(req.body)
  res.status(200).json(messages)
}
