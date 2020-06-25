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
})

export type Article = {
  id: string,
  title: string,
  summary: string,
}

export type Articles = {
  articles: Article[]
}

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)