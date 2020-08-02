import * as R from 'ramda'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import { initializeApollo } from 'apollo/client'
import { ArticlesQuery } from 'apollo/queries'
import Head from 'next/head'
import { useAnimation } from 'framer-motion';
import { motion, PanInfo } from 'framer-motion'
import { NavBar } from './Navigation'
import Footer from './Footer'
import { ArticlesResult, IArticle } from 'models/article'

type Props = {
  title: string
  activeItem: string
}

const buildRoutes = (articles: IArticle[] | undefined): string[] => {
  // console.log(`buildRoutes() articles`, articles)
  const routes = R.pipe(
    R.defaultTo([]),
    // @ts-ignore
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    // @ts-ignore
    R.sortBy(R.prop('createdAt')),
    R.map(article => `/posts/${article.id}`),
    R.concat(['/', '/posts'])
  // @ts-ignore
  )(articles)
  // console.log(`buildRoutes routes`, routes)
  return routes
}

const getNextRoute = (path: string, routes: string[], direction: number): string => {
  // console.log(`getNextRoute.routes`, routes)
  let routeIndex = routes.indexOf(path) + direction
  if (routeIndex < 0) {
    routeIndex = routes.length - 1
  }
  else if (routeIndex >= routes.length) {
    routeIndex = 0
  }
  const nextRoute = routes[routeIndex]
  // console.log(`getNextRoute.routeIndex`, routeIndex)
  // console.log(`getNextRoute.nextRoute`, nextRoute)
  return nextRoute || '/'
}

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, title, activeItem }) => {

  const router = useRouter()
  const exitAnimation = useAnimation()
  const { data } = useQuery<ArticlesResult>(ArticlesQuery)
  const [routes, setRoutes] = useState(() => buildRoutes(data?.articles))
  const [backHref, setBackHref] = useState(() => getNextRoute(router.asPath, routes, -1))
  const [nextHref, setNextHref] = useState(() => getNextRoute(router.asPath, routes, 1))

  useEffect(() => {
    const newRoutes = buildRoutes(data?.articles)
    setRoutes(newRoutes)
    setBackHref(getNextRoute(router.asPath, newRoutes, -1))
    setNextHref(getNextRoute(router.asPath, newRoutes, 1))
  }, [data])

  const back = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!e.ctrlKey) {
      e.preventDefault()
      await exitAnimation.start('exitBack')
      router.push(backHref)
    }
}

  const next = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!e.ctrlKey) {
      e.preventDefault()
      await exitAnimation.start('exitNext')
      router.push(nextHref)
      }
  }

  // avoid Flash of Unstyled Content by hiding all contents initially
  // then make it visible once loaded
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.1 },
    },
    exitBack: {
      x: '100vw',
      transition: { ease: 'easeInOut' },
      duration: 1,
    },
    exitNext: {
      x: '-100vw',
      transition: { ease: 'easeInOut' },
      duration: 1,
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <Head>
        <title>{ title }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='google-site-verification' content='yKJNmNpvtiHvsXH_CN5BxIgVy5dwktxYqpXYAQgvNdo' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400&display=swap' />
      </Head>
      <NavBar activeItem={activeItem} backHref={backHref} nextHref={nextHref} onClickBack={back} onClickNext={next} />
      <motion.div
        variants={containerVariants}
        animate={exitAnimation}
      >
        {children}
        <Footer />
      </motion.div>
    </motion.div>
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

export default Layout
