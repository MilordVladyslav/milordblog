exports.up = function (knex) {
  return knex.schema.createTable('posts', function (table) {
    table.increments()
    table.integer('post_id').notNullable().unsigned()
    table.foreign('post_id').references('users.id').onDelete('CASCADE')
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.specificType('files', 'TEXT[]')
    table.timestamp('created_at').defaultTo(knex.raw('now()'))
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('posts')
}
