# A Touch of Animation
##### July 20th, 2020 By Alex Hu

[Framer Motion](https://www.framer.com/motion/) is a animation library for React. This library is rather easy to use.
Instead of a h2, you can use motion.h2 and add the animation as props.

I added some subtle animations to the pages.

### [Timeline](/)

In the timeline, the link for article title is scaled slightly larger when hovering. The bulk of the work is to
find what the Link element actually mapped to as an anchor element and then put in the right class names. The actual
animation is a simple whileHover property.

```js
whileHover={{
  scale: 1.1,
  originX: 0,
}}
>
```

### [Article Card](/posts)

The second hover effect is the on the box shadow of the article card and a very slight scaling of it,
by a simple replacement of the Card component. You hardly notice that the animation because of the
very short duration but it is there.

```js
<motion.div
  className={clsx('article-card', 'large', 'MuiPaper-root MuiCard-root MuiPaper-outlined MuiPaper-rounded')}
  whileHover={{
    scale: 1.01,
    boxShadow: '0px 6px 6px -4px rgba(0,0,0,0.2), 0px 6px 8px 0px rgba(0,0,0,0.14), 0px 2px 16px 0px rgba(0,0,0,0.12)',
  }}
  transition={{
    duration: 0.05,
  }}
>
```

### [Flash of Unstyled Content](/posts/flash-of-unstyled-content)

I replaced the old FOUC mechanism with a simple fade in effect on a layout wrapper.

```js
import React, { PropsWithChildren } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { NavBar } from './Navigation'
import Footer from './Footer'

type Props = {
  title: string
  activeItem: string
}

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, title, activeItem }) => {
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
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
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
    </motion.div>
  )
}

export default Layout
```

### Exit Animation

I added the left / right arrow buttons at the top right corner for easy navigation to the previous / next article.
When clicked, it will trigger the exit animation by swiping the article left / right.

```js
const containerVariants = {
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

const exitAnimation = useAnimation()

const back = async () => {
  await exitAnimation.start('exitBack')
  router.push(getNextRoute(router.route, routes, -1))
}

const next = async () => {
  await exitAnimation.start('exitNext')
  router.push(getNextRoute(router.route, routes, 1))
}

<motion.div
  variants={containerVariants}
  animate={exitAnimation}
>
```
