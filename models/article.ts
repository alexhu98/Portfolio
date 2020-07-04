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
  section: {
    type: String,
    default: '',
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
})

export type IArticle = {
  id: string,
  title: string,
  summary: string,
  content: string,
  section: string,
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
