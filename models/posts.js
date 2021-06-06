const db = require('../db')

module.exports = {
  createPost,
  getPost,
  postsList,
  updatePost,
  deletePost
}

async function createPost(fields = {}) {
  const post = await db('posts').insert(fields)
  return post
}

async function getPost(id = '') {
  const post = await db('posts').where({ id })
  return post[0]
}

async function postsList(opts = {}) {
  const { offset = 0, limit = 25, tag = '' } = opts

  const table = db('posts')
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
  const posts = await db('posts')
    .where({ post_id, id })
    .update({ title, description, files })
  return posts
}

async function deletePost(fields = {}) {
  const { post_id = '', id = '' } = fields || {}
  const posts = await db('posts').where({ post_id, id }).del()
  return posts
}
