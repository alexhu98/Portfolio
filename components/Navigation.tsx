import React from 'react'
import { IconButton, Link, Paper, Tabs, Tab } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'

type Props = {
  activeItem: string,
  backHref?: string,
  nextHref?: string,
  onClickBack?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onClickNext?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export const NavBar: React.FC<Props> = ({ activeItem, backHref, nextHref, onClickBack, onClickNext }) => {

  const getBackOrNext = (href: string) => backHref === href ? onClickBack : nextHref === href ? onClickNext : undefined
  const clickHome = getBackOrNext('/')
  const clickPosts = getBackOrNext('/posts')

  return (
    <Paper className='navbar' elevation={3}>
      <Tabs value={activeItem} indicatorColor='primary' textColor='primary'>
        <Tab value='home' label='Home' component={Link} href='/' onClick={clickHome} />
        <Tab value='posts' label='Posts' component={Link} href='/posts' onClick={clickPosts} />
        {/* <Tab value='about' label='About' component={Link} href='/about' /> */}
      </Tabs>
      <div className='navbar-buttons'>
        { onClickBack && <IconButton onClick={onClickBack} href={backHref}><ArrowBack /></IconButton> }
        { onClickNext && <IconButton onClick={onClickNext} href={nextHref}><ArrowForward /></IconButton> }
      </div>
    </Paper>
  )
}
