import { IArticle } from './article'

export const DEFAULT_ARTICLE_SECTION = 'Posts'

export const DEFAULT_ARTICLE: IArticle = {
  id: '',
  title: '',
  summary: '',
  content: '',
  section: DEFAULT_ARTICLE_SECTION,
  createdAt: '',
  updatedAt: '',
}
