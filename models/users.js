const cuid = require('cuid')
const bcrypt = require('bcrypt')
const db = require('../db')
const SALT_ROUNDS = 10
async function create(fields = {}) {
  const { password = '' } = fields || {}
  fields.password = await bcrypt.hash(password, SALT_ROUNDS)
  try {
    const user = await db('users').insert(fields)
    console.log(user)
  } catch (err) {
    return err
  }
  return { success: true }
}

async function get(id = -1) {
  const user = await db('users').where({ id })
  return user[0]
}
// id,
// username,
// role,
// birthday,
// visibility,
// gender,
// description,
// avatar

async function updateUser(fields = {}) {
  const {
    id = -1,
    username = '',
    birthday = '',
    visibility = '',
    gender = '',
    description = ''
  } = fields || {}
  await db('users').where({ id }).update({
    username,
    birthday,
    visibility,
    gender,
    description
  })
  const updatedUser = await get(id)
  return updatedUser
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
  updateUser,
  updatePassword,
  deleteUser
}
