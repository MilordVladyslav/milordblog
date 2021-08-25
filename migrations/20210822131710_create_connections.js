exports.up = function (knex) {
  return knex.schema.createTable('connections', function (table) {
    table.increments()
    table.integer('from_id').notNullable()
    table.integer('to_id').notNullable()
    table.string('comment')
    table.string('status').notNullable().defaultTo('pending')
    table.boolean('seen').notNullable().defaultTo(false)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('connections')
}
