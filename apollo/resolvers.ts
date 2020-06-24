import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import { createUser, findUser, validatePassword, getUsers } from '../lib/user'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/auth-cookies'

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
      return [{
        id: 1,
        title: 'T1',
        summary: 'S1',
        content: 'C1',
        sectionName: 'S1',
        createdAt: 123,
        updatedAt: 456,
      }]
    }
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
  },
}
