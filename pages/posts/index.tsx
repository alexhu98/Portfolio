import * as R from 'ramda'
import { inspect } from 'util'
import { initializeApollo } from '../../apollo/client'
import { useQuery } from '@apollo/react-hooks'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import { Card, Container, Divider, Popup } from 'semantic-ui-react'
import { ArticlesQuery } from '../../apollo/queries'
import { Article, ArticlesResult } from '../../models/article'

const Posts = () => {
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const articles = R.defaultTo([] as Article[], data?.articles)

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        <Card.Group stackable>
          { articles.map(article =>
            <Popup wide='very'
              trigger={ <Card header={article.title} meta={article.id} description={article.summary} href={`posts/${article.id}`} /> }
              content={ <ReactMarkdown source={article.content} /> }
              on='hover'
              position='bottom center'
            />
          )}
        </Card.Group>

        <Divider />
        <pre>{ inspect(articles) }</pre>

        <Divider />
        <ReactMarkdown className='posts-content' source={markdown} />
      </Container>
    </Layout>
  )
}

const markdown = `
# Live demo

Changes are automatically rendered as you type.

## Table of Contents

* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual, "native" React DOM elements
* Allows you to escape or skip HTML (try toggling the checkboxes above)
* If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!


## HTML block below

\`\`\`
  This blockquote will change based on the HTML settings above.
\`\`\`

Pretty neat, eh?

## Tables?

| Feature   | Support |
| --------- | ------- |
| tables    | ✔ |
| alignment | ✔ |
| wewt      | ✔ |

  `

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()
  await apolloClient.query({
    query: ArticlesQuery,
  })
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Posts
