import { IArticle } from './article'

export const SITE_URL = 'https://portfolio-ivory-three.vercel.app'

export const DEFAULT_ARTICLE_SECTION = 'Posts'

export const DEFAULT_ARTICLE: IArticle = {
  id: '',
  title: '',
  summary: '',
  content: '',
  section: DEFAULT_ARTICLE_SECTION,
  images: [],
  createdAt: '',
  updatedAt: '',
}

export const EMPTY_ARTICLES = [] as IArticle[]

export const POLLING_INTERVAL = process.env.NODE_ENV === 'production' ? 0 : 2000

