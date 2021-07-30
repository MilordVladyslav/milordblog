const autoCatch = require('../lib/auto-catch')
const Users = require('../models/users')
module.exports = autoCatch({
  createUser,
  usersList,
  updateUser,
  updatePassword,
  deleteUser,
  getUser,
  updateAvatar
})

async function createUser(req, res, next) {
  if (!req.body.password) {
    return res.status(400).json({ errors: 'Password is required' })
  }
  const isRegisteredUser = await Users.get(req.body.username)
  if (isRegisteredUser) {
    res.json({ errors: 'This user is already registered' })
  }
  await Users.create(req.body)
  res.json({ success: true })
}

async function updateAvatar(req, res, next) {
  let errors = existedFields(req.files, ['avatar_path'])
  if (errors.length) {
    res.status(400).json({ errors: errors })
  }
  let { avatar_path = {} } = req.files || {}
  let { id = -1 } = req.user
  const host = req.get('host')
  avatar_path = req.protocol + '://' + host + '/' + avatar_path[0].path
  await Users.updateAvatar({ avatar_path, id })
  res.status(200).json({ success: true })
}

async function getUser(req, res, next) {
  const intId = parseInt(req.params.id)
  const user = await Users.get('', intId)
  const {
    id = -1,
    username = '',
    role = '',
    email = '',
    avatar_path = '',
    description = '',
    gender = '',
    residence_place = '',
    birthday = '',
    connections = [],
    visibility = '',
    created_at
  } = user
  res.json({
    id,
    username,
    role,
    email,
    avatar_path,
    description,
    gender,
    residence_place,
    birthday,
    connections,
    visibility,
    created_at
  })
}

async function usersList(req, res, next) {
  const users = await Users.usersList(req.body)
  res.json(users)
}

async function updateUser(req, res, next) {
  // if (!req.body.new_username) {
  //   return res.status(400).json({ errors: 'Username is required' })
  // }
  req.body.id = req.user.id
  const user = await Users.updateUser(req.body)
  const { username, role } = user
  res.json({ username, role })
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
  console.log('here')
  if (req.user.role === 'admin') {
    const users = await Users.deleteUser(username)
    res.json(users)
  } else {
    if (
      req.body.delete_username.toLowerCase() !== req.user.username.toLowerCase()
    ) {
      return res
        .status(401)
        .json({ errors: 'You do not have a permission to delete others' })
    } else {
      Users.deleteUser(username)
    }
    res.json({ message: 'Your account is successfully deleted' })
  }
}
function existedFields(reqBody = [], requiredFields = []) {
  const errors = []
  for (let key in requiredFields) {
    if (!reqBody[requiredFields[key]])
      errors.push(`${requiredFields[key]} is required`)
  }
  return errors
}
