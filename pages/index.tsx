import React from 'react'
import Layout from '../components/Layout'
import { Container, Header } from 'semantic-ui-react'

const Index = () => {
  return (
    <Layout title='Home' activeItem='home'>
      <Container>
        <Header>Home</Header>
      </Container>
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
        <Link href="/about">
          <a>about</a>
        </Link>{' '}
        page. or{' '}
        <Link href="/signout">
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
