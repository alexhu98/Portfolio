import * as R from 'ramda'
import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import { createUser, findUser, validatePassword, getUsers } from '../lib/user'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/auth-cookies'

import dbConnect from '../utils/dbConnect'
import Article from '../models/article'

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
      let articles = R.defaultTo([], await Article.find())
      articles = R.map(article => ({
        ...article._doc,
        id: article.id,
        content: R.defaultTo('', article.content),
      }), articles)
      return articles
    },
    async article(_parent: any, args: any) {
      await dbConnect()
      let article = await Article.findById(args.id)
      // console.log('article -> id, article', args.id, article)
      // if (article && !article.content) {
      if (article) {
          article = {
          ...article._doc,
          id: article.id,
          content: R.defaultTo('', article.content),
        }
      }
      return article
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
      return await article.save()
    },
    async updateArticle(_parent: any, args: any, _context: any, _info: any) {
      // console.log('updateArticle -> args', args)
      await dbConnect()
      const article = await Article.findByIdAndUpdate(args.input.id, args.input, { new: true })
      return article
    },
    async deleteArticle(_parent: any, args: any, _context: any, _info: any) {
      // console.log('deleteArticle -> args.input.id', args.input.id)
      await dbConnect()
      const result = await Article.findByIdAndDelete(args.input.id)
      // console.log('deleteArticle -> result', result)
      return result

    },
  },
}
