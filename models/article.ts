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
})

export type Article = {
  id: string,
  title: string,
  summary: string,
  content: string,
}

export type ArticleResult = {
  article: Article
}

export type ArticlesResult = {
  articles: Article[]
}

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)