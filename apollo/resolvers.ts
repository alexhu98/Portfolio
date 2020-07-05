import * as R from 'ramda'
import fs from 'fs'
import path from 'path'
import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import { createUser, findUser, validatePassword, getUsers } from '../lib/user'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/auth-cookies'
import { DEFAULT_ARTICLE_SECTION } from '../models/defaults'
import Article, { IArticle } from '../models/article'
import dbConnect from '../utils/dbConnect'

type IStore = {
  articles: IArticle[],
  sections: string[],
}

const store: IStore = {
  articles: [],
  sections: [],
}

const readArticle = (section: string, name: string): IArticle => {
  const id = name.substring(9).slice(0, -3)
  const fullPath = path.join('docs', section, name)
  const content = fs.readFileSync(fullPath).toString()
  const now = (new Date()).toISOString()
  return {
    id,
    title: name,
    summary: name,
    content,
    section,
    createdAt: now,
    updatedAt: now,
  }
}

const loadArticles = () => {
  store.articles = []
  store.sections = []
  if (!store.sections.length) {
    const docs = path.join('docs')
    const sections = fs.readdirSync(docs)
    R.forEach(section => {
      store.sections = R.append(section, store.sections)
      const names = fs.readdirSync(path.join(docs, section))
      const sortedNames = R.sort((a, b) => b.localeCompare(a), names)
      const sectionArticles = R.map(name => readArticle(section, name), sortedNames)
      console.log('loadArticles -> section = ' + section + ', sectionArticles.length =', sectionArticles.length)
      store.articles = R.concat(store.articles, sectionArticles)
    }, sections)
  }
}

const migrateArticle = async (article: IArticle) => {
  if (article) {
    let migrate = false
    if (article.content === undefined) {
      article.content = ''
      migrate = true
    }
    if (!article.section) {
      article.section = DEFAULT_ARTICLE_SECTION
      migrate = true
    }
    if (!article.createdAt) {
      article.createdAt = (new Date()).toISOString()
      migrate = true
    }
    if (!article.updatedAt) {
      article.updatedAt = (new Date()).toISOString()
      migrate = true
    }
    if (migrate) {
      console.log('migrateArticle -> article', article)
      article = await Article.findByIdAndUpdate(article.id, article, { new: true })
    }
  }
  return article
}

export const resolvers = {
  Query: {
    async viewer(_parent: any, _args: any, context: any, _info: any) {
      try {
        const session = await getLoginSession(context.req)
        if (session) {
          return findUser({ email: session.email })
        }
      } catch (error) {
        throw new AuthenticationError('Authentication token is invalid, please log in')
      }
    },
    async users () {
      return getUsers()
    },
    async articles(_parent: any, args: any) {
      console.log('articles -> args', args)
      loadArticles()
      if (args.section) {
        return R.filter(R.propEq('section', args.section), store.articles)
      }
      return store.articles

      // await dbConnect()
      // let articles = R.defaultTo([], await Article.find().sort('-createdAt'))
      // articles = R.map(article => migrateArticle(article), articles)
      // return articles
    },
    async article(_parent: any, args: any) {
      loadArticles()
      const result = R.find(R.propEq('id', args.id), store.articles)
      if (!result) {
        throw new Error('Article not found: ' + args.id)
      }
      return result

      // await dbConnect()
      // const article = await Article.findById(args.id)
      // return migrateArticle(article)
    },
  },
  Mutation: {
    async signUp(_parent: any, args: any, _context: any, _info: any) {
      const user = await createUser(args.input)
      return { user }
    },
    async signIn(_parent: any, args: any, context: any, _info: any) {
      const user = await findUser({ email: args.input.email })

      if (user && (await validatePassword(user, args.input.password))) {
        const session = {
          id: user.id,
          email: user.email,
        }
        await setLoginSession(context.res, session)
        return { user }
      }

      throw new UserInputError('Invalid email and password combination')
    },
    async signOut(_parent: any, _args: any, context: any, _info: any) {
      removeTokenCookie(context.res)
      return true
    },
    async createArticle(_parent: any, args: any, _context: any, _info: any) {
      await dbConnect()
      console.log('createArticle -> args.input', args.input)
      const now = (new Date()).toISOString()
      const article = new Article(args.input)
      article.createdAt = now
      article.updatedAt = now
      return await article.save()
    },
    async updateArticle(_parent: any, args: any, _context: any, _info: any) {
      // console.log('updateArticle -> args', args)
      await dbConnect()
      args.input.updatedAt = (new Date()).toISOString()
      const article = await Article.findByIdAndUpdate(args.input.id, args.input, { new: true })
      return migrateArticle(article)
    },
    async deleteArticle(_parent: any, args: any, _context: any, _info: any) {
      // console.log('deleteArticle -> args.input.id', args.input.id)
      await dbConnect()
      await Article.findByIdAndDelete(args.input.id)
      return true
    },
  },
}
