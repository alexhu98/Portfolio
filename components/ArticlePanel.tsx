import React from 'react'
import ReactMarkdown from 'react-markdown'
import { IArticle } from '../models/article'

type Props = {
  article?: IArticle
}

const ArticlePanel: React.FC<Props> = (props) => {
  const { article } = props;

  return (
    <div className='article-panel'>
        <ReactMarkdown source={article?.content || ''} escapeHtml={false} />
    </div>
  )
}

export default React.memo(ArticlePanel)
