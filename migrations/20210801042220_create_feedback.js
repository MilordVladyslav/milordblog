exports.up = function (knex) {
  return knex.schema.createTable('feedback', function (table) {
    table.increments()
    table.integer('from_id').notNullable()
    table.integer('entity_id').notNullable()
    table.text('comment')
    table.specificType('comment_attachments', 'TEXT[]')
    table.boolean('seen').notNullable()

  })
}
exports.down = function (knex) {
  return knex.schema.dropTable('feedback')
}