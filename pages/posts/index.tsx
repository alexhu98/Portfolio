import * as R from 'ramda'
import { inspect } from 'util'
import { initializeApollo } from '../../apollo/client'
import { useQuery } from '@apollo/react-hooks'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import { Card, Container, Divider, Popup } from 'semantic-ui-react'
import { ArticlesQuery } from '../../apollo/queries'
import { ArticleType, ArticlesResult } from '../../models/article'

const Posts = () => {
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const articles = R.defaultTo([] as ArticleType[], data?.articles)

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        <Card.Group stackable>
          { articles.map(article =>
            <Popup key={article.id} wide='very'
              trigger={ <Card header={article.title} meta={article.id} description={article.summary} href={`posts/${article.id}`} /> }
              content={ <ReactMarkdown source={article.content} /> }
              on='hover'
              position='bottom center'
            />
          )}
        </Card.Group>

        <Divider />
        <pre>{ inspect(articles) }</pre>
      </Container>
    </Layout>
  )
}

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
