import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { GetStaticProps } from 'next'
import { format } from 'date-fns'
import { useQuery } from '@apollo/react-hooks'
import { initializeApollo } from '../apollo/client'
import { ArticlesQuery } from '../apollo/queries'
import { Fade, Grid, Hidden, Link, Paper, Typography, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab'
import { ArticlesResult, IArticle } from '../models/article'
import { DEFAULT_ARTICLE, POLLING_INTERVAL } from '../models/defaults'
import Layout from '../components/Layout'
import ArticlePanel from '../components/ArticlePanel'

const renderDate = (article: IArticle, includeYear: boolean) => {
  const timestamp = new Date()
  timestamp.setFullYear(
    parseInt(article.createdAt.substring(0, 4), 10),
    parseInt(article.createdAt.substring(5, 7), 10) - 1,
    15)
  const year = article.createdAt.substring(0, 4)
  const month = format(timestamp, 'MMM')
  const day = article.createdAt.substring(8, 10)
  const [sprintNumber] = R.splitAt(2, article.title.split(' '))
  return article.section === 'Sprints'
    ? <div className='sprint-number'>{ sprintNumber.join(' ')}</div>
    : <div className='timeline-date'>
        <div className='month'>{ month }</div>
        <div className='day'>{ day }</div>
        { includeYear ? <div className='year'>{ year }</div> : null }
      </div>
}

const filterAndSortArticles = (articles: IArticle[] | undefined): IArticle[] => {
  return R.pipe(
    R.defaultTo([]),
    // @ts-ignore
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.sortBy(R.prop('createdAt'))
  // @ts-ignore
  )(articles) as IArticle[]
}

const getContentClassName = (article: IArticle) => article.section === 'Sprints' ? 'sprint-timeline-content' : 'post-timeline-content'
const getTimelineDot = (article: IArticle) => article.section === 'Sprints' ? 'default' : 'outlined'
const getTitle = (article: IArticle) => article.section === 'Sprints' ? R.splitAt(2, article.title.split(' '))[1].join(' ') : article.title

const Index = () => {
  const { data } = useQuery<ArticlesResult>(ArticlesQuery, {
    pollInterval: POLLING_INTERVAL,
  })
  const [articles, setArticles] = useState(() => filterAndSortArticles(data?.articles))
  const [selectedArticle, setSelectedArticle] = useState(articles.length ? articles[0] : DEFAULT_ARTICLE)
  const [fadeInArticle, setFadeInArticle] = useState(DEFAULT_ARTICLE)
  const [fadeIn, setFadeIn] = useState(true)
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  useEffect(() => {
    if (POLLING_INTERVAL) {
      console.log('useEffect -> data', data)
      const sortedArticles = filterAndSortArticles(data?.articles)
      setArticles(sortedArticles)
      const selected = R.find(R.propEq('id', selectedArticle.id), sortedArticles)
      if (selected) {
        setSelectedArticle(selected)
      }
    }
    else {
      console.log('useEffect -> skipping data', data)
    }
  }, [data])

  const handleTitleClick = (e: React.MouseEvent<HTMLElement>, article: IArticle) => {
    if (!xs && !e.ctrlKey) {
      e.preventDefault()
      fadeArticle(article)
    }
  }

  const fadeArticle = (article: IArticle) => {
    if (article !== selectedArticle) {
      setFadeInArticle(article)
      setFadeIn(false)
    }
  }

  const handleFadeExited = () => {
    setSelectedArticle(fadeInArticle)
    setFadeIn(true)
  }

  const getLinkUnderline = (article: IArticle) => article === selectedArticle ? 'always' : 'hover'

  return (
    <Layout title='Home' activeItem='home'>
      <Grid container spacing={0}>
        <Grid item xs={false} sm={false} md={false} lg={1} />
        <Grid item xs={12} sm={6} md={5} lg={3} >
          <Timeline align='left' className='timeline'>
            { articles.map((article, index) =>
              <TimelineItem key={article.id} className='timeline-item'>
                <TimelineOppositeContent className={clsx('timeline-content', 'timeline-timestamp', getContentClassName(article))}>
                  <Typography component='div' color='textPrimary'>{ renderDate(article, index === 0) }</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot variant={getTimelineDot(article) } />
                  { index < articles.length - 1 ? <TimelineConnector /> : null }
                </TimelineSeparator>
                <TimelineContent className={clsx('timeline-content', getContentClassName(article))}>
                  <Link
                    className='title'
                    href={`/posts/${article.id}`} onClick={(e: React.MouseEvent<HTMLElement>) => handleTitleClick(e, article)}
                    color='textPrimary'
                    underline={getLinkUnderline(article)}
                    rel='noopener'>
                    { getTitle(article) }
                  </Link>
                </TimelineContent>
              </TimelineItem>
            )}
          </Timeline>
        </Grid>
        <Grid item xs={12} sm={6} md={7} lg={7} >
          <Hidden only='xs' >
            <Fade in={fadeIn} timeout={125} onExited={handleFadeExited} >
              <Paper className='article-paper'>
                <ArticlePanel article={selectedArticle} />
              </Paper>
            </Fade>
          </Hidden>
        </Grid>
        <Grid item xs={false} sm={false} md={false} lg={1} />
      </Grid>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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
