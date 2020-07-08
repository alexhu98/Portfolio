import React, { CSSProperties } from 'react'
import Layout from '../components/Layout'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import Typography from '@material-ui/core/Typography'

const sprint1 = `
# Sprint 1 Gearing Up
##### June 8th By Alex Hu
Goal: Evaluate Different Frameworks
### TypeScript & Materialize CSS ✔
1. Create a React app with TypeScript
2. Style a NavBar with Materialize CSS
[React, Redux & Firebase App Tutorial](https://www.youtube.com/watch?v=Oi4v5uxTY5o&list=PL4cUxeGkcC9iWstfXntcj8f-dFZ4UtlN3)
### GraphQL with TypeScript ✔
1. Create a GraphQL Server with TypeScript and Data Modeling Tools
npx create-graphql-api
[Typescript GraphQL CRUD Tutorial](https://www.youtube.com/watch?v=WhzIjYQmWvs)
2. Create a Next.js GraphQL Server with TypeScript for Server-Side-Rendering
npx create-next-app --example with-typescript-graphql
`

const post1 = `
# Fresh Start
##### June 9th By Alex Hu
After converting a couple of Flex / ActionScript applications to React + Redux at work for the last few years,
it is time to refresh the server side skill set as well. To document the journey, I decided to have some fun
creating my personal portfolio site and have it serves as a test bed for different technologies.
There are quite a few things I would like to learn. The primary ones are
 - TypeScript
 - React with Hooks, without Redux
 - Node.js
 - GraphQL + Apollo
I also want to pick up these ones along the way:
 - MongoDB
 - Authentication
 - Cloud functions
 - Cloud deployment
 - Docker
 - AWS Free Tier / Google Cloud Platform Free Tier
`

const sprintNumberStyle = {
  fontFamily: '"Roboto Condensed", "Roboto", "sans-serif"',
  marginLeft: 8,
}

const sprintTitleStyle = {
  fontSize: 'smaller',
  fontFamily: '"Roboto Condensed", "Roboto", "sans-serif"',
}

const Index = () => {
  return (
    <Layout title='Home' activeItem='home'>
      <Timeline align='right'>

        {/* Sprint 1 */}

        <TimelineItem>
          <TimelineOppositeContent className='sprint-timeline-content'>
            <Typography color='textPrimary'>
              <div className='timeline-date'><span className='day'>08</span><br/><span className='month'>JUN</span></div>
              <div className='timeline-date'><span className='year'>2020</span></div>
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='h4' component='h1'>
              <span style={sprintTitleStyle}>Gearing Up</span>
              <span style={sprintNumberStyle}>Sprint 1</span>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              Fresh Start
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>09</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              Start and Stop
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>10</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              Server Side Rendering
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>11</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              GraphQL with TypeORM and TypeGraphQL
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>12</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              First Impressions of TypeScript
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>14</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* Sprint 2 */}

        <TimelineItem>
          <TimelineOppositeContent className='sprint-timeline-content'>
            <Typography color='textPrimary'>
              <div className='timeline-date'><span className='day'>15</span><br/><span className='month'>JUN</span></div>
              <div className='timeline-date'><span className='year'>2020</span></div>
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='h4' component='h1'>
              <span style={sprintTitleStyle}>Deciding on a Framework</span>
              <span style={sprintNumberStyle}>Sprint 2</span>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              GraphQL with Knex
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>16</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              CSS Frameworks
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>17</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* Sprint 3 */}

        <TimelineItem>
          <TimelineOppositeContent className='sprint-timeline-content'>
            <Typography color='textPrimary'>
              <div className='timeline-date'><span className='day'>22</span><br/><span className='month'>JUN</span></div>
              <div className='timeline-date'><span className='year'>2020</span></div>
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='h4' component='h1'>
              <span style={sprintTitleStyle}>Start Coding</span>
              <span style={sprintNumberStyle}>Sprint 3</span>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='h5' component='h1'>
              Restarting the App
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant='outlined' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color='textSecondary'>
              <div className='timeline-date'><span className='day'>23</span><br/><span className='month'>JUN</span></div>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* Sprint 4 */}

        <TimelineItem>
          <TimelineOppositeContent className='sprint-timeline-content'>
            <Typography color='textPrimary'>
              <div className='timeline-date'><span className='day'>29</span><br/><span className='month'>JUN</span></div>
              <div className='timeline-date'><span className='year'>2020</span></div>
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='h4' component='h1'>
              <span style={sprintTitleStyle}>Unit Testing and UI Improvement</span>
              <span style={sprintNumberStyle}>Sprint 4</span>
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* Sprint 5 */}

        <TimelineItem>
          <TimelineOppositeContent className='sprint-timeline-content'>
            <Typography color='textPrimary'>
              <div className='timeline-date'><span className='day'>6</span><br/><span className='month'>JUL</span></div>
              <div className='timeline-date'><span className='year'>2020</span></div>
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='h4' component='h1'>
              <span style={sprintTitleStyle}>UI Refinement</span>
              <span style={sprintNumberStyle}>Sprint 5</span>
            </Typography>
          </TimelineContent>
        </TimelineItem>

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


export default Index
