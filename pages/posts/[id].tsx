import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { initializeApollo } from '../../apollo/client'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Layout from '../../components/Layout'
import { Button, Container, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { ArticleQuery, DeleteArticleMutation } from '../../apollo/queries'
import { ArticleResult, IArticle } from '../../models/article'
import { Context } from '@apollo/react-common'
import EditArticleModal from '../../components/EditArticleModal'
import ArticlePanel from '../../components/ArticlePanel'

type Props = {
  id: string,
}

const Post: React.FC<Props> = ({ id }) => {

  const router = useRouter()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteArticle] = useMutation(DeleteArticleMutation)

  const queryResult = useQuery<ArticleResult>(ArticleQuery, {
    variables: {
      id,
    }
  })
  // console.log('queryResult', queryResult)
  const { data, loading, error } = queryResult
  if (loading) {
    return <CircularProgress />
  }
  if (!data || !data?.article || error) {
    console.log('Post -> render -> error', error)
    router.push('/posts')
    return <CircularProgress />
  }
  const [article, setArticle] = useState(data.article)

  useEffect(() => {
    setArticle(data.article)
  }, [data.article])

  const handleEdit = () => {
    console.log('Post -> handleEdit')
    setEditModalOpen(true)
  }

  const handleEditOK = async (changes: IArticle | undefined) => {
    console.log('Post -> handleEditOK -> changes', changes)
    if (changes) {
      setArticle(changes)
    }
    setEditModalOpen(false)
  }

  const handleEditCancel = () => {
    console.log('Post -> handleEditCancel')
    setEditModalOpen(false)
  }

  const handleDelete = async () => {
    console.log('handleDelete -> article.id', article.id)
    // const result = await deleteArticle({
    //   variables: {
    //     id: article.id,
    //   },
    // })
    // console.log('handleDelete -> result', result)
    router.push('/posts')
  }

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              setDeleteConfirmOpen(false)
              await handleDelete()
            }} color='primary' autoFocus>
              OK
            </Button>
            <Button onClick={() => setDeleteConfirmOpen(false)} color='primary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <EditArticleModal article={{...article}} modalOpen={editModalOpen} onOK={handleEditOK} onCancel={handleEditCancel} />
          <Button onClick={handleEdit} style={{ marginRight: 15 }} >Edit</Button>
          <Button onClick={() => setDeleteConfirmOpen(true)}>Delete</Button>
        </div>

        <ArticlePanel article={article} />
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (context: Context) => {
  const { id } = context.query
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
    console.error('Post -> getServerSideProps -> error', error)
  }
  const result = {
    props: {
      id,
      initialApolloState: apolloClient.cache.extract(),
    },
  }
  return result
}

export default Post
