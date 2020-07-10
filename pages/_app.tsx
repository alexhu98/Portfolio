import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { useApollo } from '../apollo/client'
import '../css/index.scss'

export default function App({ Component, pageProps }: any) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
