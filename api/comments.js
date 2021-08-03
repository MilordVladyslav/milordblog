const existedFields = require('../utils/existedFields')
const Comments = require('../models/comments')
async function createComment(req, res) {
  req.body.from_id = req.user.id
  let errors = existedFields(req.body, ['from_id', 'entity_id'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  if (!req.body.comment.trim() && !req.body.comment_attachments.trim()) {
    res.status(400).json({
      errors: ['the comment or comment_attachments property is required']
    })
  }
  const { comment_attachments = [] } = req.files || {}
  if (comment_attachments.length > 0) {
    const host = req.get('host')
    let commentFilesLinks = []
    for (let i = 0; i < comment_attachments.length; i++) {
      commentFilesLinks.push(
        req.protocol + '://' + host + '/' + comment_attachments[i].path
      )
    }
    req.body.comment_attachments = [...commentFilesLinks]
  }
  req.body.seen = false
  const comments = await Comments.createComment(req.body)
  res.status(200).json(comments)
}

async function getComment(req, res) {
  let errors = existedFields(req.params, ['id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  const comment = await Comments.getComment(req.params.id)
  res.status(200).json(comment)
}

async function getCommentsList(req, res) {
  let errors = existedFields(req.params, ['entity_id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  const comments = await Comments.getCommentsList(req.params.entity_id)
  res.status(200).json(comments)
}

async function updateComment(req, res) {
  const errors = existedFields(req.body, [
    'id',
  ])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  if (!req.body.comment.trim() && !req.body.comment_attachments.trim()) {
    res.status(400).json({
      errors: ['the comment or comment_attachments property is required']
    })
  }
  const feedback = Comments.updateComment(req.body)
  res.status(200).json({ feedback })
}

async function deleteComment(req, res) {
  const errors = existedFields(req.body, ['id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  await Comments.deleteComment(req.body.id)
  res.json({ success: true })
}

module.exports = {
  createComment,
  getComment,
  getCommentsList,
  updateComment,
  deleteComment
}
