import React, { ReactNode } from 'react'
import Head from 'next/head'
import { NavBar } from '../components/Navigration'
import Footer from './Footer'

type Props = {
  children?: ReactNode
  title?: string
  activeItem?: string
}

const Layout = ({ children, title = 'This is the default title', activeItem }: Props) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <NavBar activeItem={activeItem} />
    {children}
    <Footer />
  </div>
)

export default Layout
