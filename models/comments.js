const db = require('../db')

module.exports = {
  createComment,
  getComment,
  getCommentsList,
  updateComment,
  deleteComment
}
async function createComment(fields = {}) {
  const comment = await db('feedback').insert(fields)
  return comment
}

async function getComment(id = -1) {
  const comment = await db('feedback').where({ id })
  return comment[0]
}

async function getCommentsList(entity_id = -1, opts = {}) {
  const { offset = 0, limit = 25, tag = '' } = opts
  entity_id = parseInt(entity_id)
  const table = db('feedback')
  const query = table.whereRaw('entity_id = ?', [entity_id])

  const result = await query.orderBy('id').limit(limit).offset(offset)
  return result
}

async function updateComment(fields = {}) {
  const { id = -1, comment = '', comment_attachments = [''] } = fields || {}
  const feedback = await db('feedback')
    .where({ id })
    .update({ comment, comment_attachments })
  return feedback
}

async function deleteComment(id = -1) {
  const result = await db('feedback').where({ id }).del()
  return result
}

// async function  getComment(id = -1) {
//   const
// }
