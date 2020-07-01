import * as R from 'ramda'
import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import { createUser, findUser, validatePassword, getUsers } from '../lib/user'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/auth-cookies'
import Article, { IArticle } from '../models/article'
import dbConnect from '../utils/dbConnect'

const migrateArticle = async (article: IArticle) => {
  if (article) {
    let migrate = false
    if (article.content === undefined) {
      article.content = ''
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
        throw new AuthenticationError(
          'Authentication token is invalid, please log in'
        )
      }
    },
    async users () {
      return getUsers()
    },
    async articles() {
      await dbConnect()
      let articles = R.defaultTo([], await Article.find().sort('-createdAt'))
      articles = R.map(article => migrateArticle(article), articles)
      return articles
    },
    async article(_parent: any, args: any) {
      await dbConnect()
      const article = await Article.findById(args.id)
      return migrateArticle(article)
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
      const article = new Article(args.input)
      article.createdAt = (new Date()).toISOString()
      article.updatedAt = (new Date()).toISOString()
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
