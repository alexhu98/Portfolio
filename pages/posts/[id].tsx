import * as R from 'ramda'
import React from 'react'
import { GetStaticProps } from 'next'
import { initializeApollo } from '../../apollo/client'
import { Context } from '@apollo/react-common'
import Layout from '../../components/Layout'
import { Container } from '@material-ui/core'
import { ArticlesQuery } from '../../apollo/queries'
import { IArticle } from '../../models/article'
import { queryArticlesAndRoutes } from 'models/utils'
import ArticlePanel from '../../components/ArticlePanel'
import { useRouter } from 'next/router'

type Props = {
  article?: IArticle,
  backHref?: string,
  nextHref?: string,
}

const Post: React.FC<Props> = ({ article, backHref, nextHref }) => {
  const router = useRouter()
  if (!article && typeof window !== 'undefined') {
    router.replace('/')
  }

  return (
    <Layout title='Posts' backHref={backHref} nextHref={nextHref}>
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
  const { articles, backHref, nextHref } = await queryArticlesAndRoutes(apolloClient, `/posts/${id}`)
  return {
    props: {
      backHref,
      nextHref,
      article: R.head(R.filter(R.propEq('id', id), articles)),
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
