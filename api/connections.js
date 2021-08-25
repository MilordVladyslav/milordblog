const existedFields = require('../utils/existedFields')
const connections = require('../models/connections')

async function create(req, res) {
  req.body.from_id = req.user.id
  const errors = existedFields(req.body, ['from_id', 'to_id'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  const result = connections.create(req.body)
  res.status(200).json(result)
}

async function update(req, res) {
  const errors = existedFields(req.body, ['from_id', 'to_id', 'status'])
  if (errors.length) {
    res.status(400).json({ errors })
  }
  if (req.user.id !== req.body.to_id) {
    res.status(403).json({ errors: ['Forbidden'] })
  }
  const result = connections.update(req.body)
  res.status(200).json(result)
}

async function read(req, res) {
  req.body.to_id = req.user.id
  const result = await connections.read(req.body)
  console.log(result)
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
