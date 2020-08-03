// @ts-nocheck

import * as R from 'ramda'
import { IArticle } from './article'

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
