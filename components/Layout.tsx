import React, { PropsWithChildren } from 'react'
import Head from 'next/head'
import { NavBar } from '../components/Navigration'
import Footer from './Footer'

type Props = {
  title: string
  activeItem: string
}

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, title, activeItem }) => (
    <div>
    <Head>
      <title>{ title }</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto:300,400,500,700&display=swap' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400&display=swap'></link>
    </Head>
    <NavBar activeItem={activeItem} />
    {children}
    <Footer />
  </div>
)

export default Layout
