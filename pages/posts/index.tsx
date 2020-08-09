import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useQuery } from '@apollo/react-hooks'
import { Container } from '@material-ui/core'
import { initializeApollo } from '../../apollo/client'
import { ArticlesQuery } from '../../apollo/queries'
import { ArticlesResult } from '../../models/article'
import { POLLING_INTERVAL } from '../../models/defaults'
import { queryArticlesAndRoutes, reverseArticles } from '../../models/utils'
import Layout from '../../components/Layout'
import ArticleCard from '../../components/ArticleCard'

type Props = {
  backHref?: string,
  nextHref?: string,
}

const Posts: React.FC<Props> = ({ backHref, nextHref }) => {
  const { data } = useQuery<ArticlesResult>(ArticlesQuery, {
    pollInterval: POLLING_INTERVAL,
  })

  const [articles, setArticles] = useState(() => reverseArticles(data?.articles))

  useEffect(() => {
    if (POLLING_INTERVAL) {
      setArticles(reverseArticles(data?.articles))
    }
  }, [data])

  const reverseCount = Math.round(articles.length / 4) + 1

  return (
    <Layout title='Posts' backHref={backHref} nextHref={nextHref}>
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
  const { backHref, nextHref } = await queryArticlesAndRoutes(apolloClient, `/posts`)
  return {
    props: {
      backHref,
      nextHref,
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Posts
