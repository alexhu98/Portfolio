import React from 'react'
import clsx from 'clsx'
import { Card, CardContent, CardMedia, Hidden, Typography } from '@material-ui/core'
import { motion } from 'framer-motion'
import { IArticle } from '../models/article'

type Props = {
  article: IArticle,
  large: boolean,
  reverse: boolean,
}

const ArticleCard: React.FC<Props> = (props) => {
  const { article, large, reverse } = props;

  return (
    // <Card className={clsx('article-card', { large, reverse })} elevation={3} variant='outlined'>
    <motion.div
      className={clsx('article-card', { large, reverse }, 'MuiPaper-root MuiCard-root MuiPaper-outlined MuiPaper-rounded')}
      whileHover={{
        scale: 1.01,
        boxShadow: '0px 6px 6px -4px rgba(0,0,0,0.2), 0px 6px 8px 0px rgba(0,0,0,0.14), 0px 2px 16px 0px rgba(0,0,0,0.12)',
      }}
      transition={{
        duration: 0.05,
      }}
    >
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
    </motion.div>
    // </Card>
  )
}

export default React.memo(ArticleCard)
