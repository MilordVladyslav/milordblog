const db = require('../db')

module.exports = {
  createMessage,
  updateMessage,
  getMessages,
  deleteMessage
}

async function createMessage(fields = {}) {
  const messages = await db('messaging').insert(fields)
  return messages
}

async function updateMessage(fields = {}) {
  const {
    from_id = -1,
    to_id = -1,
    reactions = [''],
    message = '',
    attachments = [''],
    status = 'pending'
  } = fields || {}

  const messaging = await db('messaging')
    .whereIn(
      ['from_id', 'to_id'],
      [
        [from_id, to_id],
        [from_id, to_id]
      ]
    )
    .update({ reactions, message, attachments, status })
  return messaging
}

async function getMessages(fields) {
  const { offset = 0, limit = 25, from_id = -1, to_id = -1 } = fields
  const table = db('messaging')
  const query = table.whereRaw('from_id = ? AND to_id = ?', [from_id, to_id])
  const result = await query.orderBy('id').limit(limit).offset(offset)
  return result
}

async function deleteMessage(fields = {}) {
  const { id = -1, from_id = -1, to_id = -1 } = fields
  const messages = await db('messaging').where({ id, from_id, to_id }).del()
  return messages
}
