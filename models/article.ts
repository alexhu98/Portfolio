import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
    required: true,
  },
  createdAt: {
    type: String,
    // default: () => (new Date()).toISOString(),
  },
  updatedAt: {
    type: String,
    // default: () => (new Date()).toISOString(),
  },
})

export type IArticle = {
  id: string,
  title: string,
  summary: string,
  content: string,
  createdAt: string,
  updatedAt: string,
}

export type ArticleResult = {
  article: IArticle
}

export type ArticlesResult = {
  articles: IArticle[]
}

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)