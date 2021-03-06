exports.up = function (knex) {
  return knex.schema.createTable('articles', function (table) {
    table.increments()
    table.integer('reference_id').notNullable().unsigned()
    table.foreign('reference_id').references('users.id').onDelete('CASCADE')
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.specificType('files', 'TEXT[]')
    table.specificType('tags', 'TEXT[]')
    table.specificType('reactions', 'TEXT[]')
    table.string('article_status').notNullable().defaultTo('published')
    table.timestamp('created_at').defaultTo(knex.raw('now()'))
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('articles')
}
