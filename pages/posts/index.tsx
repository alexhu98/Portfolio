import * as R from 'ramda'
import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import { useQuery } from '@apollo/react-hooks'
import { Container, Paper } from '@material-ui/core'
import { initializeApollo } from '../../apollo/client'
import { ArticlesQuery } from '../../apollo/queries'
import { IArticle, ArticlesResult } from '../../models/article'
import Layout from '../../components/Layout'
import ArticlePanel from '../../components/ArticlePanel'

const filterAndSortArticles = (articles: IArticle[]): IArticle[] => {
  return R.pipe(
    // @ts-ignore
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.sortBy(R.prop('id')),
    // @ts-ignore
    R.reverse()
  // @ts-ignore
  )(articles) as IArticle[]
}

const Posts = () => {
  const queryResult = useQuery<ArticlesResult>(ArticlesQuery)
  const { data } = queryResult
  const [articles] = useState(() => filterAndSortArticles(R.defaultTo([] as IArticle[], data?.articles)))

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
