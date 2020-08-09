// @ts-nocheck

import * as R from 'ramda'
import { IArticle } from './article'
import { initializeApollo } from '../apollo/client'
import { ArticlesQuery } from '../apollo/queries'

export const filterAndSortArticles = (articles: IArticle[] | undefined): IArticle[] => {
  return R.pipe(
    R.defaultTo([]),
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    R.sortBy(R.prop('createdAt'))
  )(articles) as IArticle[]
}

export const reverseArticles = (articles: IArticle[] | undefined): IArticle[] => {
  return R.pipe(
    filterAndSortArticles,
    R.filter((article: IArticle) => !!article.summary),
    R.reverse(),
  )(articles) as IArticle[]
}

export const buildRoutes = (articles: IArticle[] | undefined): string[] => {
  // console.log(`buildRoutes() articles`, articles)
  const routes = R.pipe(
    filterAndSortArticles,
    R.map(article => `/posts/${article.id}`),
    R.concat(['/', '/posts'])
  // @ts-ignore
  )(articles)
  // console.log(`buildRoutes routes`, routes)
  return routes
}

export const getNextRoute = (path: string, routes: string[], direction: number): string => {
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

export const queryArticlesAndRoutes = async (apolloClient: ApolloClien, currentRoute: string) => {
  const result = await apolloClient.query({
    query: ArticlesQuery,
  })
  const articles = R.defaultTo([], result?.data?.articles)
  const routes = buildRoutes(articles)
  return {
    articles,
    backHref: getNextRoute(currentRoute, routes, -1),
    nextHref: getNextRoute(currentRoute, routes, +1),
  }
}
