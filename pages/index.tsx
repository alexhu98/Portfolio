import * as R from 'ramda'
import React, { useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@apollo/react-hooks'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import Typography from '@material-ui/core/Typography'
import { ArticlesQuery } from '../apollo/queries'
import Layout from '../components/Layout'
import { initializeApollo } from 'apollo/client'
import { ArticlesResult, IArticle } from 'models/article'

const renderDate = (article: IArticle) => {
  const timestamp = new Date(article.createdAt)
  const year = timestamp.getFullYear()
  const month = format(timestamp, 'MMM')
  const day = format(timestamp, 'dd')
  return (
    <div className='timeline-date'>
      <div className='day'>{ day }</div>
      <div className='month'>{ month }</div>
      { article.section === 'Sprints' && <div className='year'>{ year }</div> }
    </div>
  )
}

const renderSprint = (article: IArticle) => {
  const [sprintNumber, sprintTitle] = R.splitAt(2, article.title.split(' '))
  return (
    <>
      <span className='sprint-title'>{ sprintTitle.join(' ') }</span>
      <span className='sprint-number'>{ sprintNumber.join(' ') }</span>
    </>
  )
  // return article.title
}

const renderPost = (article: IArticle) => {
  return article.title
}

const renderArticle = (article: IArticle) => {
  if (article.section === 'Sprints') {
    return (
      <TimelineItem key={article.id}>
        <TimelineOppositeContent className='sprint-timeline-content'>
          <Typography component='div' color='textPrimary'>{ renderDate(article) }</Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className='sprint-timeline-content'>
          <Typography variant='h4' component='h1'>{ renderSprint(article) }</Typography>
        </TimelineContent>
      </TimelineItem>
    )
  }
  else {
    return (
      <TimelineItem key={article.id}>
        <TimelineOppositeContent className='post-timeline-content'>
          <Typography component='div'>{ renderPost(article) }</Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot variant='outlined' />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className='post-timeline-content'>
          <Typography component='div' color='textSecondary'>{ renderDate(article) }</Typography>
        </TimelineContent>
      </TimelineItem>
    )
  }
}

const filterAndSortArticles = (articles: IArticle[]): IArticle[] => {
  return R.pipe(
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.sortBy(R.prop('id'))
  // @ts-ignore
  )(articles) as IArticle[]
}

const Index = () => {
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const [allArticles] = useState(() => R.defaultTo([] as IArticle[], data?.articles))
  const [articles] = useState(filterAndSortArticles(allArticles))

  return (
    <Layout title='Home' activeItem='home'>
      <Timeline align='right'>
        { articles.map(article => renderArticle(article)) }
      </Timeline>
    </Layout>
  )
}

/*
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      id
      email
    }
  }
`
const Index = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery(ViewerQuery)
  const viewer = data?.viewer
  const shouldRedirect = !(loading || error || viewer)

  // router.push('/posts')

  // useEffect(() => {
  //   if (shouldRedirect) {
  //     router.push('/signin')
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [shouldRedirect])

  if (error) {
    return <p>{error.message}</p>
  }

  if (viewer) {
    return (
      <div>
        You're signed in as {viewer.email} goto{' '}
        <Link href='/about'>
          <a>about</a>
        </Link>{' '}
        page. or{' '}
        <Link href='/signout'>
          <a>signout</a>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href='/posts'>
        <a>Posts</a>
      </Link>
    </div>
  )
}
*/


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
