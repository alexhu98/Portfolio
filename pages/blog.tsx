// import { useRouter } from 'next/router'
// import Link from 'next/link'
import gql from 'graphql-tag'
import { inspect } from 'util'
import { initializeApollo } from '../apollo/client'
import { useQuery } from '@apollo/react-hooks'

const BlogSectionQuery = gql`
  query BlogSectionQuery {
    articles {
      title
      summary
    }
  }
`

interface ArticleType {
  title: string,
  summary: string,
}

interface BlogSectionData {
  articles: ArticleType[]
}


const Blog = () => {
  const queryResult = useQuery<BlogSectionData>(BlogSectionQuery)
  const { data } = queryResult
  const articles = data?.articles
  return (
    <div>
      <div><p>articles:</p><pre>
        {/* { JSON.stringify(articles) } */}
        { inspect(articles) }
        </pre>
      </div>
    </div>
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
