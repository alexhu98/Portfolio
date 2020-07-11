# Connecting the Client and the Server
##### June 28th, 2020 By Alex Hu

### [Apollo Client](https://www.apollographql.com/docs/react/data/mutations/)

For the Add / Edit / Delete, the client uses useMutation() to trigger a mutation.
```js
const [updateArticle] = useMutation(UpdateArticleMutation)

const changes = {
  ...article,
  title,
  summary,
  content,
}
await updateArticle({ variables: changes })
```

### [Apollo GraphQL Resolvers](https://www.apollographql.com/docs/apollo-server/data/resolvers/)

The server side implements the resolver with just a few lines:
```js
async updateArticle(_parent: any, args: any, _context: any, _info: any) {
  // console.log('updateArticle -> args', args)
  await dbConnect()
  args.input.updatedAt = (new Date()).toISOString()
  const article = await Article.findByIdAndUpdate(args.input.id, args.input, { new: true })
  return migrateArticle(article)
},
```
The [dbConnect()](/posts/20200624-connecting-to-mongodb) function makes the database connection and retries up to 10 times.

The migrateArticle() function migrates old data by adding the additional fields that were not in the initial data model,
such as the createdAt, updatedAt and section fields.
