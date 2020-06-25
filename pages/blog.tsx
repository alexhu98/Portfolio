import * as R from 'ramda'
import gql from 'graphql-tag'
import { inspect } from 'util'
import DOMPurify from 'isomorphic-dompurify'
import { initializeApollo } from '../apollo/client'
import { useQuery } from '@apollo/react-hooks'
import Layout from '../components/Layout'
import { Card, Container, Divider, Popup } from 'semantic-ui-react'
import { Article, Articles } from '../models/article'

const BlogSectionQuery = gql`
  query BlogSectionQuery {
    articles {
      id
      title
      summary
    }
  }
`

const Blog = () => {
  const queryResult = useQuery<Articles>(BlogSectionQuery)
  const { data } = queryResult
  const articles = R.defaultTo([] as Article[], data?.articles)

  const extra = `
      <p>Have fun with it. See there, told you that would be easy. Maybe there's a little something happening right here.</p>
      <p>Let's put a touch more of the magic here. How to paint. That's easy. What to paint. That's much harder. There is no right or wrong - as long as it makes you happy and doesn't hurt anyone. Trees grow however makes them happy. No pressure. Just relax and watch it happen. This is your world, whatever makes you happy you can put in it. Go crazy.</p>
      <p>You have to make those little noises or it won't work. We start with a vision in our heart, and we put it on canvas. Every time you practice, you learn more. This is the fun part Let's go up in here, and start having some fun</p>
      <p>Here's another little happy bush You gotta think like a tree. We wash our brush with odorless thinner.</p>
      <p>And I will hypnotize that just a little bit. In painting, you have unlimited power. You have the ability to move mountains. This is truly an almighty mountain.</p>
  `

  return (
    <Layout title='Blog' activeItem='blog'>
      <Container>
        <Card.Group stackable>
          { articles.map(article =>
            <Popup wide='very' size='large'
              trigger={ <Card header={article.title} meta={article.id} description={article.summary} /> }
              content={ <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(extra) }}></div> }
              on='hover'
              position='bottom center'
            />
        )}
        </Card.Group>

        <Divider />

        <pre>{ inspect(articles) }</pre>
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()
  await apolloClient.query({
    query: BlogSectionQuery,
  })
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Blog
