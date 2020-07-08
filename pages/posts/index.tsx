import * as R from 'ramda'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import { Button, Card, Container, Grid } from 'semantic-ui-react'
import { initializeApollo } from '../../apollo/client'
import { ArticlesQuery } from '../../apollo/queries'
import { DEFAULT_ARTICLE } from '../../models/defaults'
import { IArticle, ArticlesResult } from '../../models/article'
import Layout from '../../components/Layout'
import ArticlePanel from '../../components/ArticlePanel'
import EditArticleModal from '../../components/EditArticleModal'

const Posts = () => {
  const router = useRouter()
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const [articles] = useState(() => R.defaultTo([] as IArticle[], data?.articles))
  const [sprints] = useState(() => R.filter(R.propEq('section', 'Sprints'), articles))
  const [posts] = useState(() => R.filter(R.propEq('section', 'Posts'), articles))
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleEdit = () => {
    setEditModalOpen(true)
  }

  const handleEditOK = async (changes: IArticle | undefined) => {
    setEditModalOpen(false)
    if (changes) {
      router.reload()
    }
  }

  const handleEditCancel = () => {
    setEditModalOpen(false)
  }

  const handleClickCard = (id: string) => {
    // router.push(`/posts/${id}`)
  }

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container text={false}>
        <Grid columns={2} divided>
          <Grid.Column width={7}>
            <Container className='sprints-container' fluid>
              <div style={{ display: 'none', justifyContent: 'flex-end', marginBottom: 10 }}>
                <EditArticleModal article={{...DEFAULT_ARTICLE}} modalOpen={editModalOpen} onOK={handleEditOK} onCancel={handleEditCancel} />
                <Button data-testid='new-post-button' onClick={handleEdit} style={{ marginRight: 15 }} >New Post</Button>
              </div>
              <Card.Group itemsPerRow={1} stackable>
                { sprints.map(article =>
                  <Card key={article.id} as='div' onClick={() => handleClickCard(article.id)}>
                    <Card.Content>
                      <ArticlePanel article={article} />
                    </Card.Content>
                  </Card>
                )}
              </Card.Group>
            </Container>
          </Grid.Column>
          <Grid.Column width={9}>
            <Container className='posts-container' fluid>
              <div style={{ display: 'none', justifyContent: 'flex-end', marginBottom: 10 }}>
                <EditArticleModal article={{...DEFAULT_ARTICLE}} modalOpen={editModalOpen} onOK={handleEditOK} onCancel={handleEditCancel} />
                <Button data-testid='new-post-button' onClick={handleEdit} style={{ marginRight: 15 }} >New Post</Button>
              </div>
              <Card.Group itemsPerRow={1} stackable>
                { posts.map(article =>
                  <Card key={article.id} as='div' onClick={() => handleClickCard(article.id)}>
                    <Card.Content>
                      <ArticlePanel article={article} />
                    </Card.Content>
                  </Card>
                )}
              </Card.Group>
            </Container>
          </Grid.Column>
        </Grid>
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()
  try {
    await apolloClient.query({
      query: ArticlesQuery,
    })
  }
  catch (error) {
    console.error('Posts -> getStaticProps -> error', error)
  }
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Posts
