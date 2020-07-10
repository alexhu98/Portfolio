# Cloud Deployment

##### July 10th, 2020 By Alex Hu

[Vercel](https://vercel.com/), the creator of Next.js, has this really easy deployment for Next.js app.
All you need to do is to import your Git Repository and the
[Git Integrations](https://vercel.com/docs/v2/git-integrations) allows automatic deployments on every push.

For example, this site is at https://portfolio-ivory-three.vercel.app/
and I only have to manually deploy it once in the very beginning, then just push my code to
the repository. I was looking for the redeploy button on their site but couldn't find one, then
I released that it is automatic!

### [Static Site Generation](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation)

My site was built without problem and the Index page and Posts page run fine. But it gives the following
error for initial post article (pages/posts/\[id\].tsx)
```
An error occurred with this application.
This is an error with the application itself, not the platform.

502: BAD_GATEWAY
Code: NO_RESPONSE_FROM_FUNCTION
ID: sfo1::8skpg-1594403487039-f833ea7fd94f
```

I notice that the only different between them is the
[getStaticProps()](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)
is used in the Posts page, while the \[id\] page is using
[getServerSideProps()](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)
```js
export const getStaticProps = async (context: Context) => {
  console.log('getStaticProps -> context', context) // when in doubt, console log the context
  const { id } = context.params ? context.params : context.query
```

Since my site can be run using server static generation, I decide to switch to getStaticProps().

For getServerSideProps(), the id parameter is retrieved from the context.query
```js
  const { id } = context.query
```
whereas the getStaticProps() pass the id parameter through the context.params
```js
export const getStaticProps = async (context: Context) => {
  console.log('getStaticProps -> context', context) // when in doubt, console log the context
  const { id } = context.params ? context.params : context.query
  const apolloClient = initializeApollo()
  try {
    await apolloClient.query({
      query: ArticleQuery,
      variables: {
        id,
      }
    })
  }
  catch (error) {
    console.error('Post -> getStaticProps -> error', error)
  }
  return {
    props: {
      id,
      initialApolloState: apolloClient.cache.extract(),
    }
  }
}
```
Since the \[id\] page has dynamic routes, you also need a
[getStaticPaths()](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation)
to define a list of paths that have to be rendered to HTML at build time, such as
```js
export async function getStaticPaths() {
  return {
    paths: [
      '/posts/20200608-a-new-beginning',
      '/posts/20200609-sprint-1-gearing-up',
      //...
      '/posts/20200710-cloud-deployment',
    ],
    fallback: true,
  }
}

```
The actual code uses a GraphQL query for the list of articles to compile the paths.
```js
export async function getStaticPaths() {
  const apolloClient = initializeApollo()
  try {
    const result = await apolloClient.query({
      query: ArticlesQuery,
    })
    const articles = R.defaultTo([], result?.data?.articles)
    const paths = R.map(article => `/posts/${article.id}`, articles)
    return {
      paths,
      fallback: true,
    }
  }
  catch (error) {
    console.error('Post -> getStaticPaths -> error', error)
  }
  return {
    paths: [],
    fallback: true,
  }
}
```
