# Test Suite for CRUD operations
##### July 3rd, 2020 By Alex Hu

When adding new fields to the data models, it was apparent that adding new fields to the
data model is a troublesome area. When adding the createdAt and updatedAt fields, the
app was broken in numerious area, namely

1. GraphQL query
2. GraphQL mutation
3. GraphQL resolver
4. Data migration

So we need a safety net before adding new fields to minimize the potential breakage.

### Create a test suite for CRUD operations

The test suite performs these tests:

1. Create a new article in the beforeAll() function
2. Test the newly created article
3. Read all the articles and test for the newly created article
4. Read the newly created article by id
5. Update the article and test the changes
6. Read all the articles and check the migrated fields for the appropriate default values
7. Delete the article and read all the articles back to check for non-existance

```js
describe('GraphQL for Article', () => {
  let newArticle: IArticle

  beforeAll(async () => {
    // create an article for all the tests below
    const apolloClient = createApolloClient()
    try {
      const result = await apolloClient.mutate({
        mutation: CreateArticleMutation,
        variables: {
          title: 'TEST title',
          summary: 'TEST summary',
          content: 'TEST content',
        }
      })
      // console.log('result', result)
      const { data } = result
      newArticle = data.createArticle
    }
    catch (error) {
      console.error(error)
    }
  })

  it('Create Article', () => {
    const createArticle = newArticle
    expect(createArticle).toBeDefined()
    expect(typeof createArticle.id).toBe('string')
    expect(createArticle.title).toBe('TEST title')
    expect(createArticle.summary).toBe('TEST summary')
    expect(createArticle.content).toBe('TEST content')
    expect(createArticle.createdAt).toBeDefined()
    expect(new Date(createArticle.createdAt)).toBeTruthy()
    expect(createArticle.updatedAt).toBeDefined()
    expect(new Date(createArticle.updatedAt)).toBeTruthy()
    expect(createArticle.createdAt).toBe(createArticle.updatedAt)
  })

  // read all the articles and check that the newly created article is part of it
  it('Read Articles', async () => {
    const apolloClient = createApolloClient()
    const result = await apolloClient.query({
      query: ArticlesQuery,
    })
    expect(result).toBeDefined()
    const { data } = result
    expect(data).toBeDefined()
    const { articles } = data
    expect(articles).toBeDefined()
    expect(articles.length).toBeGreaterThan(0)
    expect(articles.find(article => article.id === newArticle.id)).toBeDefined()
  })

  // read the newly created article
  it('Read Article', async () => {
    const apolloClient = createApolloClient()
    const result = await apolloClient.query({
      query: ArticleQuery,
      variables: {
        id: newArticle.id,
      }
    })
    // console.log('ArticleQuery result =', result)
    expect(result).toBeDefined()
    const { data } = result
    expect(data).toBeDefined()
    const { article } = data
    expect(article).toBeDefined()
    expect(article.id).toBe(newArticle.id)
  })

  // update the newly created article
  it('Update Article', async () => {
    const apolloClient = createApolloClient()
    const result = await apolloClient.mutate({
      mutation: UpdateArticleMutation,
      variables: {
        id: newArticle.id,
        title: 'TEST title updated',
        summary: 'TEST summary updated',
        content: 'TEST content updated',
      }
    })
    // console.log('UpdateArticleMutation result = ', result)
    expect(result).toBeDefined()
    const { data } = result
    expect(data).toBeDefined()
    const { updateArticle } = data
    expect(updateArticle).toBeDefined()
    expect(updateArticle.id).toBe(newArticle.id)
    expect(updateArticle.title).toBe('TEST title updated')
    expect(updateArticle.summary).toBe('TEST summary updated')
    expect(updateArticle.content).toBe('TEST content updated')
    expect(updateArticle.createdAt).toBe(newArticle.createdAt)
    expect(updateArticle.updatedAt).not.toBe(newArticle.updatedAt)
  })

  // delete the newly created article and then read all the articles checking
  // that the deleted article is not there any more
  it('Delete Article', async () => {
    {
      const apolloClient = createApolloClient()
      const result = await apolloClient.mutate({
        mutation: DeleteArticleMutation,
        variables: {
          id: newArticle.id,
        }
      })
      // console.log('DeleteArticleMutation result =', result)
      expect(result).toBeDefined()
      const { data } = result
      expect(data).toBeDefined()
      const { deleteArticle } = data
      expect(deleteArticle).toBeTruthy()
    }
    {
      const apolloClient = createApolloClient()
      const result = await apolloClient.query({
        query: ArticlesQuery,
      })
      expect(result).toBeDefined()
      const { data } = result
      expect(data).toBeDefined()
      const { articles } = data
      expect(articles).toBeDefined()
      expect(articles.length).toBeGreaterThan(0)
      expect(articles.find(article => article.id === newArticle.id)).toBeUndefined()
    }
  })
})
```

### Add a new field to the data model with unit test

With the unit test in place, adding the section field is a matter of adding the expect()
function as below, then implement the resolvers and data migration to pass the test.
For the new field, we also test for the migration by check the appropriate default values.
```js
  // update the newly created article
  it('Update Article', async () => {
    const apolloClient = createApolloClient()
    const result = await apolloClient.mutate({
      mutation: UpdateArticleMutation,
      variables: {
        id: newArticle.id,
        title: 'TEST title updated',
        summary: 'TEST summary updated',
        content: 'TEST content updated',
        section: 'TEST section updated',
      }
    })
    //...
    expect(updateArticle.section).toBe('TEST section updated')
  })

  // read all the articles and check that the existing articles has the section default to Posts
  it('Migrate Articles', async () => {
    const apolloClient = createApolloClient()
    const result = await apolloClient.query({
      query: ArticlesQuery,
    })
    expect(result).toBeDefined()
    const { data } = result
    expect(data).toBeDefined()
    const { articles } = data
    expect(articles).toBeDefined()
    expect(articles.length).toBeGreaterThan(0)
    expect(articles.find(article => article.section === DEFAULT_ARTICLE_SECTION)).toBeDefined()
  })

```
