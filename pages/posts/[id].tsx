import * as R from 'ramda'
import React from 'react'
import { GetStaticProps } from 'next'
import { initializeApollo } from '../../apollo/client'
import { Context } from '@apollo/react-common'
import { useQuery } from '@apollo/react-hooks'
import Layout from '../../components/Layout'
import { Container } from '@material-ui/core'
import { ArticlesQuery } from '../../apollo/queries'
import { ArticlesResult } from '../../models/article'
import { filterAndSortArticles } from 'models/utils'
import ArticlePanel from '../../components/ArticlePanel'
import { useRouter } from 'next/router'

type Props = {
  id: string,
}

const Post: React.FC<Props> = ({ id }) => {

  const router = useRouter()
  const { data } = useQuery<ArticlesResult>(ArticlesQuery)
  const articles = filterAndSortArticles(data?.articles)
  const article = R.find(R.propEq('id', id), articles)

  if (!article && data && typeof window !== 'undefined') {
    router.replace('/')
  }

  return (
    <Layout title='Posts' articles={articles}>
      <Container>
        <ArticlePanel article={article} />
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context: Context) => {
  // console.log('getStaticProps -> context', context)
  const { id } = context.params ? context.params : context.query
  const apolloClient = initializeApollo()
  try {
    await apolloClient.query({
      query: ArticlesQuery,
    })
  }
  catch (error) {
    console.error('Post -> getStaticProps -> error', error)
  }
  return {
    props: {
      id,
      initialApolloState: apolloClient.cache.extract(),
    }
  }
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo()
  try {
    const result = await apolloClient.query({
      query: ArticlesQuery,
    })
    const articles = R.defaultTo([], result?.data?.articles)
    const paths = R.map(article => `/posts/${article.id}`, articles)
    // console.log('Post -> getStaticPaths -> paths', paths)
    return {
      paths,
      fallback: true,
    }
  }
  catch (error) {
    console.error('Post -> getStaticPaths -> error', error)
  }
  return {
    paths: [],
    fallback: true,
  }
}

export default Post
