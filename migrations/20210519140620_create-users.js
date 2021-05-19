exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.text('_id').primary()
    table.text('nickname').notNullable()
    table.text('password').notNullable()
    table.text('role').notNullable()
    table.text('email').notNullable()
    table.timestamp('created_at').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
