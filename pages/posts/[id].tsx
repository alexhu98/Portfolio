import { useState } from 'react'
import { initializeApollo } from '../../apollo/client'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Layout from '../../components/Layout'
import { Button, Confirm, Container, Header, Loader } from 'semantic-ui-react'
import { ArticleQuery, DeleteArticleMutation, UpdateArticleMutation } from '../../apollo/queries'
import { ArticleResult, ArticleType } from '../../models/article'
import { Context } from '@apollo/react-common'
import EditArticleModel from '../../components/EditArticleModel'
import ArticlePanel from '../../components/ArticlePanel'

const Post = ({ id }: any) => {

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [updateArticle] = useMutation(UpdateArticleMutation)
  const [deleteArticle] = useMutation(DeleteArticleMutation)

  const queryResult = useQuery<ArticleResult>(ArticleQuery, {
    variables: {
      id,
    }
  })
  const { data, error } = queryResult
  if (error) {
    return <pre>{ error.message }</pre>
  }
  const article = data?.article!

  const [title, setTitle] = useState(article.title)
  const [summary, setSummary] = useState(article.summary)
  const [content, setContent] = useState(article.content)
  const [saving, setSaving] = useState(false)

  const handleEdit = () => {
    console.log('Post -> handleEdit')
    setEditModalOpen(true)
  }

  const handleEditOK = async (changes: ArticleType) => {
    console.log('Post -> handleEditOK -> changes', changes)
    setEditModalOpen(false)
    setSaving(true)
    const result = await updateArticle({
      variables: changes
    });
    console.log('handleEditOK -> result', result)
    setTitle(changes.title)
    setSummary(changes.summary)
    setContent(changes.content)
    setSaving(false)
  }

  const handleEditCancel = () => {
    console.log('Post -> handleEditCancel')
    setEditModalOpen(false)
  }

  const handleDelete = async () => {
    console.log('handleDelete -> article.id', article.id)
    const result = await deleteArticle({
      variables: {
        id: article.id,
      },
    })
    console.log('handleDelete -> result', result)
    window.location.replace('/posts')
  }

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        <EditArticleModel article={article} modalOpen={editModalOpen} onOK={handleEditOK} onCancel={handleEditCancel} onClose={handleEditCancel} />
        <Confirm header='Delete' open={deleteConfirmOpen} onConfirm={handleDelete} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Loader active={saving} />
          <Button onClick={handleEdit} style={{ marginRight: 15 }} >Edit</Button>
          <Button onClick={() => setDeleteConfirmOpen(true)}>Delete</Button>
        </div>

        <ArticlePanel article={{
          id,
          title,
          summary,
          content,
        }} />
      </Container>
    </Layout>
  )
}

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
