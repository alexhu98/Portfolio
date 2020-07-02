import * as R from 'ramda'
import React, { useState } from 'react'
import { initializeApollo } from '../../apollo/client'
import { useQuery } from '@apollo/react-hooks'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import { Button, Card, Container, Divider, Popup } from 'semantic-ui-react'
import { ArticlesQuery } from '../../apollo/queries'
import { IArticle, ArticlesResult } from '../../models/article'
import EditArticleModal from '../../components/EditArticleModal'

const Posts = () => {
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const [articles, setArticles] = useState(() => R.defaultTo([] as IArticle[], data?.articles))
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleEdit = () => {
    console.log('Post -> handleEdit')
    setEditModalOpen(true)
  }

  const handleEditOK = async (changes: IArticle | undefined) => {
    console.log('Post -> handleEditOK -> changes', changes)
    setEditModalOpen(false)
    if (changes) {
      setArticles(R.prepend(changes, articles))
    }
  }

  const handleEditCancel = () => {
    console.log('Post -> handleEditCancel')
    setEditModalOpen(false)
  }

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <EditArticleModal article={undefined} modalOpen={editModalOpen} onOK={handleEditOK} onCancel={handleEditCancel} />
          <Button data-testid='new-post-button' onClick={handleEdit} style={{ marginRight: 15 }} >New Post</Button>
        </div>
        <Card.Group stackable>
          { articles.map(article =>
            <Popup key={article.id} wide='very'
              trigger={ <Card header={article.title} meta={article.updatedAt} description={article.summary} href={`posts/${article.id}`} /> }
              content={ <ReactMarkdown source={article.content} /> }
              on='hover'
              position='bottom center'
            />
          )}
        </Card.Group>

        <Divider />
        {/* <pre>{ inspect(articles) }</pre> */}
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
