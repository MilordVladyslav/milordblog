const cuid = require('cuid')
const bcrypt = require('bcrypt')
const db = require('../db')
const SALT_ROUNDS = 10
async function create(fields = {}) {
  const { password = '' } = fields || {}
  fields.password = await bcrypt.hash(password, SALT_ROUNDS)
  await db('users').insert(fields)
  return fields
}

async function get(username = '') {
  const user = await db('users').where({ username })
  return user[0]
}

async function updateUsername(fields = {}) {
  const { username = '', new_username = '' } = fields || {}
  const user = await db('users')
    .where({ username })
    .update('username', new_username)
  return user
}

async function updatePassword(fields = {}) {
  const { username = '', new_password = '' } = fields || {}
  const encryptedPassword = await bcrypt.hash(new_password, SALT_ROUNDS)
  const user = await db('users')
    .where({ username })
    .update('password', encryptedPassword)
  return user
}

async function deleteUser(username = '') {
  const users = await db('users').where({ username }).del()
  return users
}

async function usersList(opts = {}) {
  const { offset = 0, limit = 25, tag = '' } = opts

  const table = db('users')
  const query = tag ? table.whereRaw('? = ANY (tags)', [tag]) : table

  const result = await query.orderBy('id').limit(limit).offset(offset)
  return result
}

module.exports = {
  create,
  get,
  usersList,
  updateUsername,
  updatePassword,
  deleteUser
}