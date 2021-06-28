exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('username').unique().notNullable()
    table.string('password').notNullable()
    table.string('role').notNullable().defaultTo('user')
    table.string('email').notNullable()
    table.string('avatar')
    table.string('description')
    table.string('gender')
    table.string('residence_place')
    table.string('birthday')
    table.specificType('connections', 'integer[]')
    table.string('visibility')
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
  })
  // .then(() => {
  //   return knex.raw(
  //     'ALTER TABLE users ADD COLUMN password varchar(255) NOT NULL CHECK(LENGTH(password) >= 8)'
  //   )
  // })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
