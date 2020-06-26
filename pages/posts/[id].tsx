import * as R from 'ramda'
import { inspect } from 'util'
import { initializeApollo } from '../../apollo/client'
import { useQuery } from '@apollo/react-hooks'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import { Container, Divider, Header, Loader } from 'semantic-ui-react'
import { ArticleQuery } from '../../apollo/queries'
import { ArticleResult } from '../../models/article'
import { Context } from '@apollo/react-common'

const Post = ({ id }: any) => {
  const queryResult = useQuery<ArticleResult>(ArticleQuery, {
    variables: {
      id,
    }
  })
  const { data, error } = queryResult
  if (error) {
    return <pre>{ error.message }</pre>
  }
  const article = data?.article
  return (
    <Layout title='Posts' activeItem='posts'>
      { article &&
        <Container>
          <Header as='h1'>{ article.title }</Header>
          <Header as='h5'>{ article.id }</Header>
          <Header as='h2'>{ article.summary }</Header>
          <ReactMarkdown source={article.content} />

          <Divider />
          <pre>{ inspect(article) }</pre>

          <Divider />
          <ReactMarkdown className='posts-content' source={markdown} />
        </Container>
      }
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

export const getServerSideProps = async (context: Context) => {
  const { id } = context.query
  const apolloClient = initializeApollo()
  await apolloClient.query({
    query: ArticleQuery,
    variables: {
      id,
    }
  })
  return {
    props: {
      id,
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Post
