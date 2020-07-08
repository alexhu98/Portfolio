# GraphQL with TypeORM and TypeGraphQL

##### June 12th, 2020 By Alex Hu

[**GraphQL**](https://graphql.org/) gains a lot of steam in the last few years. It is easy to understand why it has
a good following as [there are a lot to like](https://graphql.org/learn/):

* Easy to learn query language
* JSON result that match up with the query
* Strong data type and schema
* Graph*i*QL

What sold me was actually [Graph*i*QL](https://github.com/graphql/graphiql). There is nothing like a good interactive
query browser as you can build and test the server side changes without touching a line of the client app.

On the other hand, I am not too crazy about having to define the data types 3 times:

 1. GraphQL schema
 2. Database models
 3. TypeScript data types

Wouldn't it be good to define the model only once? Well, the community already build this beast using
[TypeORM](https://github.com/typeorm/typeorm) and [TypeGraphQL](https://typegraphql.com/) and YouTube
has an excellent [Typescript GraphQL CRUD Tutorial](https://www.youtube.com/watch?v=WhzIjYQmWvs) for it.
Basically,

```
npx create-graphql-api
```

will get you started with all the packages and you create the models in TypeScript using TypeORM and TypeGraphQL annotations.
TypeORM also supports a wide array of databases, including MySQL, Postgres and MongoDB NoSQL database.

If I were starting a large scale project for a business, it would be a right fit for it. However, since this project is a
learning tool for me, TypeORM and TypeGraphQL hide too much details and actually hampering the learning process.
I also notice that there are a good number of annotations to map between the different data types. It would be difficult
for me to judge if TypeORM and TypeGraphQL worths the effort until I have a chance to go back to basic with just barebone
database access.
