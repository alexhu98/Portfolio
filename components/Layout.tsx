import React, { PropsWithChildren, useState, useEffect } from 'react'
import Head from 'next/head'
import { NavBar } from './Navigation'
import Footer from './Footer'

type Props = {
  title: string
  activeItem: string
}

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, title, activeItem }) => {
  // avoid Flash of Unstyled Content by hiding all contents initially
  // then make it visible once loaded
  const [foucClassName, setFoucClassName] = useState('fouc')

  useEffect(() => {
    setFoucClassName('')
  }, [])

  return (
    <div className={foucClassName}>
      <Head>
        <title>{ title }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='google-site-verification' content='yKJNmNpvtiHvsXH_CN5BxIgVy5dwktxYqpXYAQgvNdo' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400&display=swap' />
      </Head>
      <NavBar activeItem={activeItem} />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
