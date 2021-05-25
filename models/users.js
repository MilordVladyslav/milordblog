const cuid = require('cuid')
const bcrypt = require('bcrypt')
const db = require('../db')
const SALT_ROUNDS = 10
async function create(fields) {
  const { password = '' } = fields || {}
  fields.password = await bcrypt.hash(password, SALT_ROUNDS)
  await db('users').insert(fields)
  return fields
}

async function get(username) {
  const user = await db('users').where({ username })
  console.log(user[0])
  return user[0]
}

module.exports = {
  create,
  get
}
