import React from 'react'
import { render } from '@testing-library/react'
import { ApolloProvider } from '@apollo/react-hooks'
import { initializeApollo } from '../apollo/client'
import Footer from '../components/Footer'
import Posts from './posts'
import About from './about'
import { ArticlesQuery } from '../apollo/queries'

describe('Jest self test', () => {
  it('true be true', () => {
    expect(true).toBe(true)
  })

  it('Footer render correctly', () => {
    // const { queryByTestId, queryByPlaceholderText } = render(<Footer />)
    const { queryByTestId } = render(<Footer />)
    expect(queryByTestId('footer-divider')).toBeTruthy()
  })
})

describe('About page', () => {
  it('true be true', () => {
    expect(true).toBe(true)
  })

  it('About render correctly', () => {
    // const result = renderer.create(<About />)
    const result = render(<About />)
    // console.log('result', result)
    const { queryByTestId } = result
    expect(queryByTestId('footer-divider')).toBeTruthy()
  })
})

describe('Posts page', () => {
  it('true be true', () => {
    expect(true).toBe(true)
  })

  it('Posts render correctly', async () => {
    let apolloClient = initializeApollo()
    await apolloClient.query({
      query: ArticlesQuery,
    })
    const initialApolloState = apolloClient.cache.extract()
    // console.log('initialApolloState', initialApolloState)
    apolloClient = initializeApollo(initialApolloState)
    const result = render(
      <ApolloProvider client={apolloClient}>
        <Posts/>)
      </ApolloProvider>
    )
    const { queryByTestId } = result
    expect(queryByTestId('footer-divider')).toBeTruthy()
    expect(queryByTestId('new-post-button')).toBeTruthy()
  })

  it('ArticlesQuery', async () => {
    const apolloClient = initializeApollo()
    await apolloClient.query({
      query: ArticlesQuery,
    })
    const initialApolloState = apolloClient.cache.extract()
    expect(initialApolloState).toBeTruthy()
    const { ROOT_QUERY }  = initialApolloState
    expect(ROOT_QUERY).toBeTruthy()
    // console.log('ROOT_QUERY', ROOT_QUERY)
  })
})
