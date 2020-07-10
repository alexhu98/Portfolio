import * as R from 'ramda'
import React, { useState } from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useQuery } from '@apollo/react-hooks'
import { initializeApollo } from '../apollo/client'
import { ArticlesQuery } from '../apollo/queries'
import { Grid, Hidden, Typography, useMediaQuery, Link } from '@material-ui/core'
import { useTheme  } from '@material-ui/core/styles'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab'
import { ArticlesResult, IArticle } from '../models/article'
import { DEFAULT_ARTICLE } from 'models/defaults'
import Layout from '../components/Layout'
import ArticlePanel from '../components/ArticlePanel'

const renderDate = (article: IArticle, includeYear: boolean) => {
  const timestamp = new Date(article.createdAt)
  const year = timestamp.getFullYear()
  const month = format(timestamp, 'MMM')
  const day = format(timestamp, 'dd')
  const [sprintNumber] = R.splitAt(2, article.title.split(' '))
  return article.section === 'Sprints'
    ? <div className='sprint-number'>{ sprintNumber.join(' ')}</div>
    : <div className='timeline-date'>
        { includeYear ? <div className='year'>{ year }</div> : null }
        <div className='day'>{ day }</div>
        <div className='month'>{ month }</div>
      </div>
}

const filterAndSortArticles = (articles: IArticle[]): IArticle[] => {
  return R.pipe(
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.sortBy(R.prop('id'))
  // @ts-ignore
  )(articles) as IArticle[]
}

const getContentClassName = (article: IArticle) => article.section === 'Sprints' ? 'sprint-timeline-content' : 'post-timeline-content'
const getTimelineDot = (article: IArticle) => article.section === 'Sprints' ? 'default' : 'outlined'
const getTitle = (article: IArticle) => article.section === 'Sprints' ? R.splitAt(2, article.title.split(' '))[1].join(' ') : article.title

const Index = () => {
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const [allArticles] = useState(() => R.defaultTo([] as IArticle[], data?.articles))
  const [articles] = useState(filterAndSortArticles(allArticles))
  const [selected, setSelected] = useState(articles.length ? articles[0] : DEFAULT_ARTICLE)
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const handleTitleClick = (e: React.MouseEvent, article: IArticle) => {
    if (!xs && !e.ctrlKey) {
      e.preventDefault()
      setSelected(article)
    }
  }

  return (
    <Layout title='Home' activeItem='home'>
      <Grid container spacing={0}>
        <Grid item xs={false} sm={false} md={1} />
        <Grid item xs={12} sm={6} md={3} >
          <Timeline align='left'>
            { articles.map((article, index) =>
              <TimelineItem key={article.id}>
                <TimelineOppositeContent className={clsx('timeline-content', getContentClassName(article))}>
                  <Typography component='div' color='textPrimary'>{ renderDate(article, index === 0) }</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot variant={getTimelineDot(article) } />
                  { index < articles.length - 1 ? <TimelineConnector /> : null }
                </TimelineSeparator>
                <TimelineContent className={clsx('timeline-content', getContentClassName(article))}>
                  <Link color='textPrimary' className='title' href={`/posts/${article.id}`} onClick={(e) => handleTitleClick(e, article)} rel='noopener'>
                    { article === selected
                      ? <u>{ getTitle(article) }</u>
                      : <span>{ getTitle(article) }</span>
                    }
                  </Link>
                </TimelineContent>
              </TimelineItem>
            )}
          </Timeline>
        </Grid>
        <Grid item xs={12} sm={6} md={7} >
          <Hidden only='xs' >
            <ArticlePanel article={selected} />
          </Hidden>
        </Grid>
        <Grid item xs={false} sm={false} md={1} />
      </Grid>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()
  try {
    await apolloClient.query({
      query: ArticlesQuery,
    })
  }
  catch (error) {
    console.error('Posts -> getStaticProps -> error', error)
  }
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
