import React from 'react'
import clsx from 'clsx'
import { Card, CardContent, CardMedia, Hidden, Typography } from '@material-ui/core'
import { IArticle } from '../models/article'

type Props = {
  article: IArticle,
  large: boolean,
  reverse: boolean,
}

const ArticleCard: React.FC<Props> = (props) => {
  const { article, large, reverse } = props;

  return (
    <Card className={clsx('article-card', { large, reverse })} elevation={3}>
      { article.images.length === 0 ? null :
        <Hidden only='xs'>
          <CardMedia
            className='media'
            image={article.images[0]}
          />
        </Hidden>
      }
      <CardContent className='content'>
        <Typography gutterBottom variant='h5' component='a' href={`/posts/${article.id}`}>
          { article.title }
        </Typography>
        <Typography variant='body2' color='textSecondary' component='a' href={`/posts/${article.id}`}>
          <p>{ article.summary }</p>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default React.memo(ArticleCard)
