import * as R from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Form, Grid, Modal, Loader } from 'semantic-ui-react'
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
  const [saving, setSaving] = useState(false)
  const [createArticle] = useMutation(CreateArticleMutation)
  const [updateArticle] = useMutation(UpdateArticleMutation)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [titleRef.current])

  useEffect(() => {
    setTitle(article.title)
    setSummary(article.summary)
    setContent(article.content)
  }, [article])

  const handleOK = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    const changes = {
      ...article,
      title,
      summary,
      content,
    }
    const result = article.id === '' ? await createArticle({ variables: changes }) : await updateArticle({ variables: changes })
    console.log('EditArticleModal.handleOK -> result', result)
    setSaving(false)
    onOK(result?.data?.createArticle || result?.data?.updateArticle)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <Modal open={modalOpen} onClose={handleCancel}>
      <Modal.Content>
        <Modal.Description>
          <Grid columns={2} divided>
            <Grid.Column>
              <ArticlePanel article={{
                ...article,
                title,
                summary,
                content,
              }} />
            </Grid.Column>
            <Grid.Column>
              <Form onSubmit={handleOK}>
                <div className='field'>
                  <div className='ui input'>
                    <input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} ref={titleRef} />
                  </div>
                </div>
                {/* <Form.Input autoFocus placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} /> */}
                <Form.TextArea placeholder='Summary' value={summary} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setSummary((e.target as HTMLTextAreaElement).value)} />
                <Form.TextArea placeholder='Content' value={content} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setContent((e.target as HTMLTextAreaElement).value)} style={{ minHeight: '30vh' }} />
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Loader active={saving} />
        <Button onClick={handleOK} type='submit'>OK</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(EditArticleModal)
