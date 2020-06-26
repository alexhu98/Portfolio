import React from 'react'
import { inspect } from 'util'
import ReactMarkdown from 'react-markdown'
import { Header, Divider } from 'semantic-ui-react'
import { ArticleType } from '../models/article'

type Props = {
  article: ArticleType
}

const ArticlePanel = (props: Props) => {
  const { article } = props;
  return (
    <div>
        <Header as='h3'>{ article.title }</Header>
        <div className='ui meta' style={{ fontSize: '1em', color: 'rgba(0,0,0,0.4)', margin: '-10px 0px' }}>{ article.id }</div>
        <Header as='h4'>{ article.summary }</Header>
        <ReactMarkdown source={article.content} />
        <Divider />
        <pre>{ inspect(article) }</pre>
    </div>
  )
}

export default React.memo(ArticlePanel)
