import React from 'react'
import ReactMarkdown from 'react-markdown'
import { IArticle } from '../models/article'

type Props = {
  article: IArticle
}

const ArticlePanel: React.FC<Props> = (props) => {
  const { article } = props;
  return (
    <div className='article-panel'>
        {/* <Header as='h3'>{ article.title }</Header>
        <Header as='h5'>{ article.section }</Header>
        <Header as='h5'>{ article.updatedAt }</Header>
        <Header as='h4'>{ article.summary }</Header> */}
        <ReactMarkdown source={article.content} />
        {/* <Divider />
        <pre>{ inspect(article) }</pre> */}
    </div>
  )
}

export default React.memo(ArticlePanel)
