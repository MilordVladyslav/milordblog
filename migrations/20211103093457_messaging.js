exports.up = function (knex) {
  return knex.schema.createTable('messaging', function (table) {
    table.increments()
    table.integer('from_id').notNullable()
    table.integer('to_id').notNullable()
    table.specificType('reactions', 'TEXT[]')
    table.text('message')
    table.specificType('attachments', 'TEXT[]')
    table.string('status').notNullable().defaultTo('pending')
    table.timestamp('created_at').defaultTo(knex.raw('now()'))
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('messaging')
}
