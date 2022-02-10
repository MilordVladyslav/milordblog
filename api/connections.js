const existedFields = require('../utils/existedFields')
const connections = require('../models/connections')
const Users = require('../models/users')
async function create(req, res) {
  req.body.from_id = req.user.id
  const errors = existedFields(req.body, ['from_id', 'to_id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  let existedUser = await Users.get('', req.body.to_id)
  if (!existedUser) {
    return res.status(400).json({
      errors: ['this user does not exist']
    })
  }
  const result = connections.create(req.body)
  res.status(200).json(result)
}

async function update(req, res) {
  const errors = existedFields(req.body, ['to_id', 'status'])
  req.body.to_id = req.user.id
  if (errors.length) {
    res.status(400).json({ errors })
  }
  const result = connections.update(req.body)
  res.status(200).json(result)
}

async function read(req, res) {
  req.body.to_id = req.user.id
  const result = await connections.read(req.body)
  res.status(200).json({ result })
}

async function del(req, res) {
  const errors = existedFields(req.body, ['id'])
  if (errors.length) {
    return res.status(200).json({ errors })
  }
  const result = await connections.del(req.body)
  res.status(200).json(result)
}

module.exports = {
  create,
  update,
  read,
  del
}
