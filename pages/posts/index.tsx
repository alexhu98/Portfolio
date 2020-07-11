import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useQuery } from '@apollo/react-hooks'
import { Container, Paper } from '@material-ui/core'
import { initializeApollo } from '../../apollo/client'
import { ArticlesQuery } from '../../apollo/queries'
import { IArticle, ArticlesResult } from '../../models/article'
import { POLLING_INTERVAL } from '../../models/defaults'
import Layout from '../../components/Layout'
import ArticlePanel from '../../components/ArticlePanel'

const filterAndSortArticles = (articles: IArticle[] | undefined): IArticle[] => {
  return R.pipe(
    R.defaultTo([]),
    // @ts-ignore
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.sortBy(R.prop('createdAt')),
    // @ts-ignore
    R.reverse()
  // @ts-ignore
  )(articles) as IArticle[]
}

const Posts = () => {
  const { data } = useQuery<ArticlesResult>(ArticlesQuery, {
    pollInterval: POLLING_INTERVAL,
  })
  const [articles, setArticles] = useState(() => filterAndSortArticles(data?.articles))

  useEffect(() => {
    if (POLLING_INTERVAL) {
      setArticles(filterAndSortArticles(data?.articles))
    }
  }, [data])

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container>
        { articles.map(article =>
          <Paper className='article-paper' key={article.id} elevation={1}>
            <ArticlePanel key={article.id} article={article} />
          </Paper>
        )}
      </Container>
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

export default Posts
