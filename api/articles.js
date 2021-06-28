const autoCatch = require('../lib/auto-catch')
const Articles = require('../models/articles')
module.exports = autoCatch({
  createPost,
  getPost,
  postsList,
  updatePost,
  deletePost
})

async function createPost(req, res, next) {
  req.body.post_id = req.user.id
  let errors = existedFields(req.body, ['title', 'description', 'post_id'])
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
  await Articles.createPost(req.body)
  const articles = await Articles.postsList()
  res.json(articles)
}

async function getPost(req, res, next) {
  let errors = existedFields(req.query, ['id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  const article = await Articles.getPost(req.query.id)
  res.json(article)
}

async function postsList(req, res, next) {
  const articles = await Articles.postsList(req.body)
  res.json(articles)
}

async function updatePost(req, res, next) {
  req.body.post_id = req.user.id
  let errors = existedFields(req.body, ['title', 'description', 'post_id'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  await Articles.updatePost(req.body)
  const articles = await Articles.postsList()
  res.json(articles)
}

function existedFields(reqFields = [], requiredFields = []) {
  const errors = []
  for (let key in requiredFields) {
    if (!reqFields[requiredFields[key]])
      errors.push(`${requiredFields[key]} is required`)
  }
  return errors
}

async function deletePost(req, res, next) {
  req.body.post_id = req.user.id
  let errors = existedFields(req.body, ['id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  await Articles.deletePost(req.body)
  const articles = await Articles.postsList()
  res.json(articles)
}
