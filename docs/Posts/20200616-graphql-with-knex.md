# GraphQL with Knex
##### June 16th, 2020 By Alex Hu

Back to basic [building a GraphQL server in Next.js](https://www.youtube.com/watch?v=Hn5neKIfJs8)
using [knex.js](https://github.com/knex/knex) which is *a SQL query builder that is flexible, portable, and fun to use!*

Knex supports a good number of SQL database, but MongoDB is not one that it support as MongoDB is a NoSQL database.
You can access database by building a query like this:
```
knex.select().from('articles').orderBy('article_order', 'asc')
```
What I especially like is it's support for [database migrations](http://perkframework.com/v1/guides/database-migrations-knex.html)
and [seeding](https://dev.to/cesareferrari/database-seeding-with-knex-51gf). Yes, you have to write the migration files and seed files
by hand but they are easy to to do. In fact, instead of creating the table on a SQL table by hand, you can and you should create the
table in your development machine using a migration file, so that the table can be created ain the production database automatically.
After adding the migration file, running the **`knex migrate:latest`** command will bring the system up to the latest migration.

```js
exports.up = function(knex) {
  return knex.schema.createTable('sections', table => {
    table.increments()
    table.string('name').notNullable()
    table.integer('section_order').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('sections')
}
```

Running the *knex seed:run* command with the seed file below will seed the sections table.

```js
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sections').del()
    .then(function () {
      // Inserts seed entries
      return knex('sections').insert([
        {id: 1, name: 'Main', section_order: 1},
        {id: 2, name: 'Blog', section_order: 2},
        {id: 9, name: 'About', section_order: 9},
      ]);
    });
};
```
Knex is just a thin layer on top of the normal SQL query, and it also supports raw SQL shall you desire it.

This little side project also showed me how all the pieces are tied together, namely GraphQL resolvers, typeDefs
and Apollo server.
