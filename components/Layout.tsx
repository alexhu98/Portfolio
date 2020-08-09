import React, { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimation } from 'framer-motion';
import { motion } from 'framer-motion'
import { IconButton, Link, Paper, Tabs, Tab } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
import Footer from './Footer'

type Props = {
  title: string
  backHref?: string,
  nextHref?: string,
}

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, title, backHref, nextHref }) => {
  const router = useRouter()
  const exitAnimation = useAnimation()
  const activeItem = router.asPath

  const back = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!e.ctrlKey && backHref) {
      e.preventDefault()
      await exitAnimation.start('exitBack')
      router.push(backHref)
    }
}

  const next = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!e.ctrlKey && nextHref) {
      e.preventDefault()
      await exitAnimation.start('exitNext')
      router.push(nextHref)
    }
  }

  // avoid Flash of Unstyled Content by hiding all contents initially
  // then make it visible once loaded
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.1 },
    },
    exitBack: {
      x: '100vw',
      transition: { ease: 'easeInOut' },
      duration: 1,
    },
    exitNext: {
      x: '-100vw',
      transition: { ease: 'easeInOut' },
      duration: 1,
    },
  }

  const clickBackOrNext = (href: string) => backHref === href ? back : nextHref === href ? next : undefined

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible'>
      <Head>
        <title>{ title }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='google-site-verification' content='yKJNmNpvtiHvsXH_CN5BxIgVy5dwktxYqpXYAQgvNdo' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400&display=swap' />
        <link rel='prefetch' href={backHref} as='document' />
        <link rel='prefetch' href={nextHref} as='document' />
      </Head>

      <Paper className='navbar' elevation={3}>
        <Tabs value={activeItem} indicatorColor='primary' textColor='primary'>
          <Tab value='/' label='Home' component={Link} href='/' onClick={clickBackOrNext('/')} />
          <Tab value='/posts' label='Posts' component={Link} href='/posts' onClick={clickBackOrNext('/posts')} />
          {/* <Tab value='about' label='About' component={Link} href='/about' /> */}
        </Tabs>
        <div className='navbar-buttons'>
          <IconButton onClick={back} href={backHref}><ArrowBack /></IconButton>
          <IconButton onClick={next} href={nextHref}><ArrowForward /></IconButton>
        </div>
      </Paper>

      <motion.div variants={containerVariants} animate={exitAnimation}>
        {children}
        <Footer />
      </motion.div>
    </motion.div>
  )
}

export default Layout
