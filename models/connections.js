const db = require('../db')

async function create(fields = {}) {
  const res = await db('connections').insert(fields)
  return res
}

async function update(fields = {}) {
  const { from_id = -1, to_id = -1, status = 'pending' } = fields || {}
  const res = await db('connections')
    .where({ from_id, to_id })
    .update({ status })
  return res
}

async function read(fields) {
  const { offset = 0, limit = 25, to_id = -1 } = fields || {}
  const res = await db('connections')
    .where({ to_id })
    .orderBy('id')
    .limit(limit)
    .offset(offset)
  return res
}

async function del(fields) {
  const { id = -1 } = fields
  const res = await db('connections').where({ id }).del()
  return res
}

module.exports = {
  create,
  update,
  read,
  del
}
