import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { useApollo } from '../apollo/client'
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import 'semantic-ui-css/semantic.min.css'
import '../css/index.scss'

export default function App({ Component, pageProps }: any) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
