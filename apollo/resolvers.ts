import * as R from 'ramda'
import fs from 'fs'
import path from 'path'
import { differenceInSeconds } from 'date-fns'
import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import { createUser, findUser, validatePassword, getUsers } from '../lib/user'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/auth-cookies'
import { DEFAULT_ARTICLE, DEFAULT_ARTICLE_SECTION, SITE_URL } from '../models/defaults'
import Article, { IArticle } from '../models/article'
import dbConnect from '../utils/dbConnect'

const MIN_SUMMARY_WORDS = 30
const MAX_SUMMARY_WORDS = 60

const SITE_MAP_UPDATE_DURATION = 60

type IStore = {
  articles: IArticle[],
  sections: string[],
}

const store: IStore = {
  articles: [],
  sections: [],
}

const parseLine = (line: string) => {
  return line.replace(/\(.*\)/g, '').replace(/\[/g, '').replace(/\]/g, '').replace(/\*/g, '')
}

const parseSummary = (content: string) => {
  const lines = content.split('\n')
  const summaryLines = [] as string[]
  const contentLines = [] as string[]
  let contentFound = false
  let contentStopped = false
  R.forEach((line: string) => {
    line = line.trim()
    if (line.length === 0) {
      contentFound = true
    }
    else if (contentFound) {
      if (!contentStopped) {
        if (line.startsWith('#') || line.startsWith('!') || line.startsWith('\`\`\`')) {
          contentStopped = true
        }
        else {
          contentLines.push(parseLine(line))
        }
      }
    }
    else if (line.startsWith('#### ')) {
      summaryLines.push(parseLine(line.replace(/\#/g, '')))
    }
  }, lines)
  let summary = ''
  if (summaryLines.length > 0) {
    summary = summaryLines.join(' ')
  }
  else {
    const words = contentLines.join(' ').split(' ')
    summary = words.length < MIN_SUMMARY_WORDS ? '' : R.take(MAX_SUMMARY_WORDS, words).join(' ')
  }
  if (R.last(summary) === '.') {
    summary = R.init(summary)
  }
  if (summary) {
    summary += '...'
  }
  return summary
}

const parseContent = (id: string, content: string) => {
  const fullPath = path.join('public', 'images', id + '.jpg')
  if (fs.existsSync(fullPath)) {
    let lines = content.split('\n')
    if (lines.length > 3) {
      const mainImage = `![main](/images/${id}.jpg)`
      lines = R.concat(
        R.append(mainImage, R.slice(0, 2, lines)),
        R.slice(2, Infinity, lines)
      )
      content = lines.join('\n')
    }
  }
  return content
}

const parseImages = (content: string) => {
  const imageTags = R.defaultTo([], content.match(/\!\[.*\]\(.*\)/g))
  // @ts-ignore
  return R.map(imageTag => imageTag.match(/\(.*\)/)[0].slice(1, -1), imageTags)
}

const parseCreatedAt = (name: string) => {
  const yearToken = name.substring(0, 4)
  const monthToken = name.substring(4, 6)
  const dayToken = name.substring(6, 8)
  return `${yearToken}-${monthToken}-${dayToken}T00:00:00.000Z`
}

const parseArticle = (section: string, name: string, id: string, content: string, updatedAt: Date): IArticle => {
  const lines = content.split('\n')
  const title = lines[0].substring(2)
  const createdAt = parseCreatedAt(name)
  content = parseContent(id, content)
  return {
    id,
    title,
    summary: parseSummary(content),
    content,
    section,
    images: parseImages(content),
    createdAt,
    updatedAt: updatedAt.toISOString(),
  }
}

const readArticle = (section: string, name: string): IArticle => {
  const id = name.substring(9).slice(0, -3)
  // const id = name.slice(0, -3)
  const fullPath = path.join('docs', section, name)
  const content = fs.readFileSync(fullPath).toString()
  const stats = fs.statSync(fullPath)
  return parseArticle(section, name, id, content, stats.mtime)
}

const loadArticles = () => {
  if (process.env.NODE_ENV !== 'production') {
    store.articles = []
    store.sections = []
  }
  if (!store.sections.length) {
    const docs = path.join('docs')
    const sections = fs.readdirSync(docs)
    R.forEach(section => {
      store.sections = R.append(section, store.sections)
      const names = fs.readdirSync(path.join(docs, section))
      const sortedNames = R.sort((a, b) => b.localeCompare(a), names)
      const sectionArticles = R.map(name => readArticle(section, name), sortedNames)
      store.articles = R.concat(store.articles, sectionArticles)
    }, sections)
    // console.log(`loadArticles -> store.sections.length = `, store.sections.length)
    // console.log(`loadArticles -> store.articles.length = `, store.articles.length)
  }
  generateSiteMap(store.articles)
}

const generateSiteMap = (articles: IArticle[]) => {
  const siteMapPath = path.join('public', 'sitemap.txt')
  articles = R.filter(article => ['Sprints', 'Posts'].includes(article.section), articles)
  let needUpdate = process.env.NODE_ENV !== 'production'
  if (needUpdate && fs.existsSync(siteMapPath)) {
    const stats = fs.statSync(siteMapPath)
    needUpdate = differenceInSeconds(new Date(), stats.mtime) > SITE_MAP_UPDATE_DURATION
  }
  if (needUpdate) {
    const list = R.concat(
      [
        SITE_URL,
        `${SITE_URL}/posts`,
      ],
      R.reverse(R.map(article => `${SITE_URL}/posts/${article.id}`, articles)),
    )
    const data = list.join('\r\n') + '\r\n'
    fs.writeFileSync(siteMapPath, data)
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
      // console.log('migrateArticle -> article', article)
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
      // console.log('articles -> args', args)
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
        // throw new Error('Article not found: ' + args.id)
        return {
          ...DEFAULT_ARTICLE,
          content: '# ' + 'Article not found: ' + args.id,
        }
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
