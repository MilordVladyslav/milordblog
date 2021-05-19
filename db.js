const knex = require('knex')
const config = require('./knexfile')[process.env.NODE_ENV]

module.exports = knex(config)
