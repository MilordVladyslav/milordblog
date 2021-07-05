const db = require('../db')

module.exports = {
  createArticle,
  getArticle,
  articlesList,
  updateArticle,
  deleteArticle
}

async function createArticle(fields = {}) {
  const article = await db('articles').insert(fields)
  return article
}

async function getArticle(id = '') {
  const article = await db('articles').where({ id })
  return article[0]
}

async function articlesList(opts = {}) {
  const { offset = 0, limit = 25, tag = '' } = opts

  const table = db('articles')
  const query = tag ? table.whereRaw('? = ANY (tags)', [tag]) : table

  const result = await query.orderBy('id').limit(limit).offset(offset)
  return result
}

async function updateArticle(fields = {}) {
  const {
    title = '',
    description = '',
    reference_id = '',
    id = '',
    files = ['']
  } = fields || {}
  console.log(id)
  const articles = await db('articles')
    .where({ reference_id, id })
    .update({ title, description, files })
  return articles
}

async function deleteArticle(fields = {}) {
  const { reference_id = '', id = '' } = fields || {}
  const articles = await db('articles').where({ reference_id, id }).del()
  return articles
}
