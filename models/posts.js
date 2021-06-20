const db = require('../db')

module.exports = {
  createPost,
  getPost,
  postsList,
  updatePost,
  deletePost
}

async function createPost(fields = {}) {
  const article = await db('articles').insert(fields)
  return article
}

async function getPost(id = '') {
  const article = await db('articles').where({ id })
  return article[0]
}

async function postsList(opts = {}) {
  const { offset = 0, limit = 25, tag = '' } = opts

  const table = db('articles')
  const query = tag ? table.whereRaw('? = ANY (tags)', [tag]) : table

  const result = await query.orderBy('id').limit(limit).offset(offset)
  return result
}

async function updatePost(fields = {}) {
  const {
    title = '',
    description = '',
    post_id = '',
    id = '',
    files = []
  } = fields || {}
  const articles = await db('articles')
    .where({ post_id, id })
    .update({ title, description, files })
  return articles
}

async function deletePost(fields = {}) {
  const { post_id = '', id = '' } = fields || {}
  const articles = await db('articles').where({ post_id, id }).del()
  return articles
}
