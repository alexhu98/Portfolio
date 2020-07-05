import React from 'react'
import { render } from '@testing-library/react'
import { ApolloProvider } from '@apollo/react-hooks'
import { createApolloClient } from '../apollo/client'
import Footer from '../components/Footer'
import Posts from './posts'
import About from './about'
import { ArticlesQuery, CreateArticleMutation, ArticleQuery, DeleteArticleMutation, UpdateArticleMutation } from '../apollo/queries'
import { DEFAULT_ARTICLE_SECTION } from '../models/defaults'
import { IArticle } from '../models/article'

describe('Jest self test', () => {
  it('true be true', () => {
    expect(true).toBe(true)
  })
})

describe('About page', () => {
  it('About render correctly', () => {
    // const result = renderer.create(<About />)
    const result = render(<About />)
    // console.log('result', result)
    const { queryByTestId } = result
    expect(queryByTestId('footer-divider')).toBeTruthy()
  })
})

describe('Posts page', () => {
  it('Posts render correctly', async () => {
    let apolloClient = createApolloClient()
    await apolloClient.query({
      query: ArticlesQuery,
    })
    const initialApolloState = apolloClient.cache.extract()
    // console.log('initialApolloState', initialApolloState)
    apolloClient = createApolloClient(initialApolloState)
    const result = render(
      <ApolloProvider client={apolloClient}>
        <Posts/>)
      </ApolloProvider>
    )
    const { queryByTestId } = result
    expect(queryByTestId('footer-divider')).toBeTruthy()
    expect(queryByTestId('new-post-button')).toBeTruthy()
  })

})

// describe('GraphQL for Article', () => {
//   let newArticle: IArticle

//   beforeAll(async () => {
//     // create an article for all the tests below
//     const apolloClient = createApolloClient()
//     try {
//       const result = await apolloClient.mutate({
//         mutation: CreateArticleMutation,
//         variables: {
//           title: 'TEST title',
//           summary: 'TEST summary',
//           content: 'TEST content',
//           section: 'TEST section',
//         }
//       })
//       // console.log('result', result)
//       const { data } = result
//       newArticle = data.createArticle
//     }
//     catch (error) {
//       console.error(error)
//     }
//   })

//   it('Create Article', () => {
//     const createArticle = newArticle
//     expect(createArticle).toBeDefined()
//     expect(typeof createArticle.id).toBe('string')
//     expect(createArticle.title).toBe('TEST title')
//     expect(createArticle.summary).toBe('TEST summary')
//     expect(createArticle.content).toBe('TEST content')
//     expect(createArticle.section).toBe('TEST section')
//     expect(createArticle.createdAt).toBeDefined()
//     expect(new Date(createArticle.createdAt)).toBeTruthy()
//     expect(createArticle.updatedAt).toBeDefined()
//     expect(new Date(createArticle.updatedAt)).toBeTruthy()
//     expect(createArticle.createdAt).toBe(createArticle.updatedAt)
//   })

//   // read all the articles and check that the newly created article is part of it
//   it('Read Articles', async () => {
//     const apolloClient = createApolloClient()
//     const result = await apolloClient.query({
//       query: ArticlesQuery,
//     })
//     expect(result).toBeDefined()
//     const { data } = result
//     expect(data).toBeDefined()
//     const { articles } = data
//     expect(articles).toBeDefined()
//     expect(articles.length).toBeGreaterThan(0)
//     expect(articles.find(article => article.id === newArticle.id)).toBeDefined()
//   })

//   // read the newly created article
//   it('Read Article', async () => {
//     const apolloClient = createApolloClient()
//     const result = await apolloClient.query({
//       query: ArticleQuery,
//       variables: {
//         id: newArticle.id,
//       }
//     })
//     // console.log('ArticleQuery result =', result)
//     expect(result).toBeDefined()
//     const { data } = result
//     expect(data).toBeDefined()
//     const { article } = data
//     expect(article).toBeDefined()
//     expect(article.id).toBe(newArticle.id)
//   })

//   // update the newly created article
//   it('Update Article', async () => {
//     const apolloClient = createApolloClient()
//     const result = await apolloClient.mutate({
//       mutation: UpdateArticleMutation,
//       variables: {
//         id: newArticle.id,
//         title: 'TEST title updated',
//         summary: 'TEST summary updated',
//         content: 'TEST content updated',
//         section: 'TEST section updated',
//       }
//     })
//     // console.log('UpdateArticleMutation result = ', result)
//     expect(result).toBeDefined()
//     const { data } = result
//     expect(data).toBeDefined()
//     const { updateArticle } = data
//     expect(updateArticle).toBeDefined()
//     expect(updateArticle.id).toBe(newArticle.id)
//     expect(updateArticle.title).toBe('TEST title updated')
//     expect(updateArticle.summary).toBe('TEST summary updated')
//     expect(updateArticle.content).toBe('TEST content updated')
//     expect(updateArticle.section).toBe('TEST section updated')
//     expect(updateArticle.createdAt).toBe(newArticle.createdAt)
//     expect(updateArticle.updatedAt).not.toBe(newArticle.updatedAt)
//   })


//   // read all the articles and check that the existing articles has the section default to Posts
//   it('Migrate Articles', async () => {
//     const apolloClient = createApolloClient()
//     const result = await apolloClient.query({
//       query: ArticlesQuery,
//     })
//     expect(result).toBeDefined()
//     const { data } = result
//     expect(data).toBeDefined()
//     const { articles } = data
//     expect(articles).toBeDefined()
//     expect(articles.length).toBeGreaterThan(0)
//     expect(articles.find(article => article.section === DEFAULT_ARTICLE_SECTION)).toBeDefined()
//   })

//   // delete the newly created article and then read all the articles checking
//   // that the deleted article is not there any more
//   it('Delete Article', async () => {
//     {
//       const apolloClient = createApolloClient()
//       const result = await apolloClient.mutate({
//         mutation: DeleteArticleMutation,
//         variables: {
//           id: newArticle.id,
//         }
//       })
//       // console.log('DeleteArticleMutation result =', result)
//       expect(result).toBeDefined()
//       const { data } = result
//       expect(data).toBeDefined()
//       const { deleteArticle } = data
//       expect(deleteArticle).toBeTruthy()
//     }
//     {
//       const apolloClient = createApolloClient()
//       const result = await apolloClient.query({
//         query: ArticlesQuery,
//       })
//       expect(result).toBeDefined()
//       const { data } = result
//       expect(data).toBeDefined()
//       const { articles } = data
//       expect(articles).toBeDefined()
//       expect(articles.length).toBeGreaterThan(0)
//       expect(articles.find(article => article.id === newArticle.id)).toBeUndefined()
//     }
//   })
// })
