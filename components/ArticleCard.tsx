import React from 'react'
import { Card, CardContent, CardMedia, Hidden, Typography } from '@material-ui/core'
import { IArticle } from '../models/article'

type Props = {
  article: IArticle
}

const ArticleCard: React.FC<Props> = (props) => {
  const { article } = props;

  return (
    <Card className='article-card'>
      { article.images.length === 0 ? null :
        <Hidden only='xs'>
          <CardMedia
            className='media'
            image={article.images[0]}
          />
        </Hidden>
      }
      <CardContent className='content'>
        <Typography gutterBottom variant='h5' component='h2'>
          { article.title }
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          { article.summary }
        </Typography>
      </CardContent>
    </Card>
  )
}

export default React.memo(ArticleCard)
