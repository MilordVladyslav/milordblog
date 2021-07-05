const autoCatch = require('./lib/auto-catch')
const Users = require('./models/users')
const Articles = require('./models/articles')
module.exports = autoCatch({
  createUser,
  login,
  usersList,
  updateUser,
  updatePassword,
  deleteUser,
  createPost,
  getPost,
  postsList,
  updatePost,
  deletePost,
  updateAvatar
})
async function createUser(req, res, next) {
  let errors = existedFields(req.body, ['username', 'password', 'email'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  const preparedValues = trimStrings(req.body)
  const user = await Users.create(preparedValues)
  if (user.severity) {
    return res.status(500).json({ errors: 'An unexpected error occurred' })
  }
  const {
    id,
    username,
    role,
    birthday,
    visibility,
    gender,
    description,
    avatar
  } = user
  res.json({
    id,
    username,
    role,
    birthday,
    visibility,
    gender,
    description,
    avatar
  })
}

async function updateAvatar(req, res, next) {
  const { avatar = {} } = req.files || {}
  let errors = existedFields(req.files, ['avatar'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  res.status(200).json({ success: true })
}

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

function existedFields(reqBody = [], requiredFields = []) {
  const errors = []
  for (let key in requiredFields) {
    if (!reqBody[requiredFields[key]])
      errors.push(`${requiredFields[key]} is required`)
  }
  return errors
}

async function login(req, res, next) {
  const user = await Users.get(req.body)
  const { username, role } = user
  res.json({ username, role })
}

async function usersList(req, res, next) {
  if (req.user.role === 'admin') {
    const users = await Users.usersList(req.body)
    res.json(users)
  } else {
    return res.status(400).json({ errors: 'The user should be an admin' })
  }
}

async function updateUser(req, res, next) {
  const preparedValues = trimStrings(req.body)
  req.body.id = req.user.id
  const user = await Users.updateUser(preparedValues)
  if (user.severity) {
    return res.status(500).json({ errors: 'An unexpected error occurred' })
  }
  const {
    id,
    username,
    role,
    birthday,
    visibility,
    gender,
    description,
    avatar
  } = user
  res.json({
    id,
    username,
    role,
    birthday,
    visibility,
    gender,
    description,
    avatar
  })
}

async function updatePassword(req, res, next) {
  if (!req.body.new_password) {
    return res.status(400).json({ errors: 'password is required' })
  }
  const user = await Users.updatePassword(req.body)
  const { username, role } = user
  res.json({ username, role })
}

async function deleteUser(req, res, next) {
  const username = req.body.delete_username || ''
  if (req.user.role === 'admin') {
    const users = await Users.delete(username)
    res.json(users)
  } else {
    if (
      req.body.delete_username.toLowerCase() !== req.user.username.toLowerCase()
    ) {
      return res
        .status(401)
        .json({ errors: 'You do not have a permission to delete others' })
    } else {
      Users.delete(username)
    }
    res.json({ message: 'Your account is successfully deleted' })
  }
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

function trimStrings(reqBody) {
  for (const value in reqBody) {
    if (typeof reqBody[value] === 'string') {
      reqBody[value] = reqBody[value].trim()
    }
  }
  return reqBody
}
