const autoCatch = require('./lib/auto-catch')
const Users = require('./models/users')
module.exports = autoCatch({
  createUser,
  login
})

async function createUser(req, res, next) {
  if (!req.body.password) {
    return res
      .status(400)
      .json({ errors: 'Password length must be at least 8 characters' })
  }
  const user = await Users.create(req.body)
  const { id, username, role } = user
  res.json({ id, username, role })
}

async function login(req, res, next) {
  const user = await Users.login(req.body)
  const { id, username, role } = user
  res.json({ id, username, role })
}
