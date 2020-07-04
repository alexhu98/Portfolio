import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { initializeApollo } from '../../apollo/client'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Layout from '../../components/Layout'
import { Button, Confirm, Container } from 'semantic-ui-react'
import { ArticleQuery, DeleteArticleMutation } from '../../apollo/queries'
import { DEFAULT_ARTICLE_SECTION } from '../../models/defaults'
import { ArticleResult, IArticle } from '../../models/article'
import { Context } from '@apollo/react-common'
import EditArticleModal from '../../components/EditArticleModal'
import ArticlePanel from '../../components/ArticlePanel'

type Props = {
  id: string,
}

const DEFAULT_ARTICLE: IArticle = {
  id: '',
  title: '',
  summary: '',
  content: '',
  section: '',
  createdAt: '',
  updatedAt: '',
}

const Post: React.FC<Props> = ({ id }) => {

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteArticle] = useMutation(DeleteArticleMutation)

  const queryResult = useQuery<ArticleResult>(ArticleQuery, {
    variables: {
      id,
    }
  })
  const { data, error } = queryResult
  if (!data?.article || error) {
      return <pre>{ error ? error.message : 'Error loading article' }</pre>
  }
  const article = data?.article

  const [title, setTitle] = useState(article.title)
  const [summary, setSummary] = useState(article.summary)
  const [content, setContent] = useState(article.content)
  const [section, setSection] = useState(DEFAULT_ARTICLE_SECTION)
  const [createdAt, setCreatedAt] = useState(article.createdAt)
  const [updatedAt, setUpdatedAt] = useState(article.updatedAt)
  const router = useRouter()

  const handleEdit = () => {
    console.log('Post -> handleEdit')
    setEditModalOpen(true)
  }

  const handleEditOK = async (changes: IArticle | undefined) => {
    console.log('Post -> handleEditOK -> changes', changes)
    if (changes) {
      setTitle(changes.title)
      setSummary(changes.summary)
      setContent(changes.content)
      setCreatedAt(changes.createdAt)
      setUpdatedAt(changes.updatedAt)
    }
    setEditModalOpen(false)
    // router.reload()
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
    router.push('/posts')
  }

  const currentArticle = {
    id,
    title,
    summary,
    content,
    section,
    createdAt,
    updatedAt,
  }
  console.log('currentArticle', currentArticle)

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        <Confirm header='Delete' open={deleteConfirmOpen} onConfirm={handleDelete} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <EditArticleModal article={currentArticle} modalOpen={editModalOpen} onOK={handleEditOK} onCancel={handleEditCancel} />
          <Button onClick={handleEdit} style={{ marginRight: 15 }} >Edit</Button>
          <Button onClick={() => setDeleteConfirmOpen(true)}>Delete</Button>
        </div>

        <ArticlePanel article={currentArticle} />
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
