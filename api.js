const autoCatch = require('./lib/auto-catch')
const Users = require('./models/users')
module.exports = autoCatch({
  createUser,
  login,
  usersList,
  updateUsername,
  updatePassword,
  deleteUser
})

async function createUser(req, res, next) {
  if (!req.body.password) {
    return res.status(400).json({ errors: 'Password is required' })
  }
  const user = await Users.create(req.body)
  const { username, role } = user
  res.json({ username, role })
}

async function login(req, res, next) {
  const user = await Users.login(req.body)
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

async function updateUsername(req, res, next) {
  if (!req.body.new_username) {
    return res.status(400).json({ errors: 'Username is required' })
  }
  const user = await Users.updateUsername(req.body)
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
