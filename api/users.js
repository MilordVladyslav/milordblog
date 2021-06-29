const autoCatch = require('../lib/auto-catch')
const Users = require('../models/users')
module.exports = autoCatch({
  createUser,
  usersList,
  updateUser,
  updatePassword,
  deleteUser,
  getUser
})

async function createUser(req, res, next) {
  if (!req.body.password) {
    return res.status(400).json({ errors: 'Password is required' })
  }
  const user = await Users.create(req.body)
  const { username, role } = user
  res.json({ username, role })
}

async function getUser(req, res, next) {
  const intId = parseInt(req.params.id)
  const user = await Users.get('', intId)
  const {
    id = -1,
    username = '',
    role = '',
    email = '',
    avatar = '',
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
    avatar,
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
