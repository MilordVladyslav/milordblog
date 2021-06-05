const db = require('../db')

module.exports = {
  createPost,
  getPost,
  postsList
}

async function createPost(fields = {}) {
  const post = await db('posts').insert(fields)
  return post
}

async function getPost(id = '') {
  const post = await db('post').where({ id })
  return post[0]
}

async function postsList(opts = {}) {
  const { offset = 0, limit = 25, tag = '' } = opts

  const table = db('users')
  const query = tag ? table.whereRaw('? = ANY (tags)', [tag]) : table

  const result = await query.orderBy('id').limit(limit).offset(offset)
  return result
}

// async function updatePost (fields = {} ) {
//   const { title = '', description = '' } = fields || {}
//   const user = await db('users')
//     .where({ id })
//     .update('title', title)
//   return user
// }
