import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useQuery } from '@apollo/react-hooks'
import { Container } from '@material-ui/core'
import { initializeApollo } from '../../apollo/client'
import { ArticlesQuery } from '../../apollo/queries'
import { IArticle, ArticlesResult } from '../../models/article'
import { POLLING_INTERVAL } from '../../models/defaults'
import Layout from '../../components/Layout'
import ArticleCard from '../../components/ArticleCard'

const filterAndSortArticles = (articles: IArticle[] | undefined) => {
  return R.pipe(
    R.defaultTo([]),
    // @ts-ignore
    R.filter(article => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.filter(article => article.summary),
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

  const reverseCount = Math.round(articles.length / 4) + 1

  return (
    <Layout title='Posts' activeItem='posts'>
      <Container maxWidth='md'>
        <h2 className='recent-articles'>Recent Articles</h2>
        { articles.map((article, index) =>
          <ArticleCard
            key={article.id}
            article={article}
            large={index === 0 || index === articles.length - 1}
            reverse={index > 0 && index % reverseCount === 0}
          />
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
