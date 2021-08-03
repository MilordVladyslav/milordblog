const autoCatch = require('../lib/auto-catch')
const Articles = require('../models/articles')
const existedFields = require('../utils/existedFields')
module.exports = autoCatch({
  createArticle,
  getArticle,
  articlesList,
  updateArticle,
  deleteArticle
})

async function createArticle(req, res) {
  req.body.reference_id = req.user.id
  let errors = existedFields(req.body, ['title', 'description', 'reference_id'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  const { article_files = [] } = req.files || {}
  if (article_files.length > 0) {
    const host = req.get('host')
    let articleFilesLinks = []
    for (let i = 0; i < article_files.length; i++) {
      articleFilesLinks.push(
        req.protocol + '://' + host + '/' + article_files[i].path
      )
    }
    req.body.files = [...articleFilesLinks]
  }
  await Articles.createArticle(req.body)
  const articles = await Articles.articlesList()
  res.json(articles)
}

async function getArticle(req, res) {
  let errors = existedFields(req.params, ['id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  const article = await Articles.getArticle(req.params.id)
  res.json(article)
}

async function articlesList(req, res) {
  const articles = await Articles.articlesList(req.params.id)
  res.json(articles)
}

async function updateArticle(req, res) {
  req.body.reference_id = req.user.id
  let errors = existedFields(req.body, ['title', 'description', 'reference_id'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  await Articles.updateArticle(req.body)
  const articles = await Articles.articlesList()
  res.json(articles)
}

async function deleteArticle(req, res) {
  req.body.reference_id = req.user.id
  let errors = existedFields(req.body, ['id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  await Articles.deleteArticle(req.body)
  const articles = await Articles.articlesList()
  res.json(articles)
}
