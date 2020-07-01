import React from 'react'
import { inspect } from 'util'
import ReactMarkdown from 'react-markdown'
import { Header, Divider } from 'semantic-ui-react'
import { IArticle } from '../models/article'

type Props = {
  article: IArticle
}

const ArticlePanel: React.FC<Props> = (props) => {
  const { article } = props;
  return (
    <div>
        <Header as='h3'>{ article.title }</Header>
        <Header as='h5'>{ article.updatedAt }</Header>
        <Header as='h4'>{ article.summary }</Header>
        <ReactMarkdown source={article.content} />
        <Divider />
        <pre>{ inspect(article) }</pre>
    </div>
  )
}

export default React.memo(ArticlePanel)
