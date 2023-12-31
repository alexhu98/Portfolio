import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Dialog, DialogActions, DialogContent, Grid } from '@material-ui/core'
import ArticlePanel from './ArticlePanel'
import { IArticle } from '../models/article'
import { CreateArticleMutation, UpdateArticleMutation } from '../apollo/queries'

type Props = {
  article: IArticle,
  modalOpen: boolean,
  onOK: (article: IArticle | undefined) => void,
  onCancel: () => void,
}

const EditArticleModal: React.FC<Props> = (props) => {
  const { article, modalOpen, onOK, onCancel } = props
  const [title, setTitle] = useState(R.defaultTo('', article?.title))
  const [summary, setSummary] = useState(R.defaultTo('', article?.summary))
  const [content, setContent] = useState(R.defaultTo('', article?.content))
  const [createArticle] = useMutation(CreateArticleMutation)
  const [updateArticle] = useMutation(UpdateArticleMutation)

  useEffect(() => {
    setTitle(article.title)
    setSummary(article.summary)
    setContent(article.content)
  }, [article])

  const handleOK = async (event: React.MouseEvent<HTMLButtonElement>
                               | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const changes = {
      ...article,
      title,
      summary,
      content,
    }
    const result = article.id === '' ? await createArticle({ variables: changes }) : await updateArticle({ variables: changes })
    console.log('EditArticleModal.handleOK -> result', result)
    onOK(result?.data?.createArticle || result?.data?.updateArticle)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <Dialog className='edit-article-modal' fullWidth={true} maxWidth='lg' open={modalOpen} onClose={handleCancel}>
      <DialogContent>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <textarea
              className='article-content'
              value={content}
              placeholder='Content'
              onChange={(e) => setContent(e.currentTarget.value)} style={{ minHeight: '30vh' }}
            />
          </Grid>
          <Grid item xs={6}>
            <ArticlePanel article={{
                ...article,
                title,
                summary,
                content,
              }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOK} type='submit' primary>OK</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(EditArticleModal)
