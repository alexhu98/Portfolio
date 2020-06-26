import React, { useState } from 'react'
import { Button, Form, Grid, Modal } from 'semantic-ui-react'
import { ArticleType } from '../models/article'
import ArticlePanel from './ArticlePanel'

type Props = {
  article: ArticleType,
  modalOpen: boolean,
  onOK: (article: ArticleType) => void,
  onCancel: () => void,
  onClose: () => void,
}

const EditArticleModel = (props: Props) => {
  const { article, modalOpen, onOK, onCancel, onClose } = props

  const [id, setId] = useState(article.id)
  const [title, setTitle] = useState(article.title)
  const [summary, setSummary] = useState(article.summary)
  const [content, setContent] = useState(article.content)

  const handleOK = () => {
    onOK({ id, title, summary, content })
  }

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.Description>
          <Grid columns={2} divided>
            <Grid.Column>
              <ArticlePanel article={{
                id,
                title,
                summary,
                content,
              }} />
            </Grid.Column>
            <Grid.Column>
              <Form onSubmit={handleOK}>
                <Form.Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                <Form.TextArea placeholder='Summary' value={summary} onChange={(e) => setSummary(e.target.value)} />
                <Form.TextArea placeholder='Content' value={content} onChange={(e) => setContent(e.target.value)} style={{ minHeight: '30vh' }} />
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleOK} type='submit'>OK</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(EditArticleModel)
