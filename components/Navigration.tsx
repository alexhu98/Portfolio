import React from 'react'
import { Link, Paper, Tabs, Tab } from '@material-ui/core'

type Props = {
  activeItem: string
}

export const NavBar: React.FC<Props> = ({ activeItem }) => {
  return (
    <Paper className='navbar'>
      <Tabs value={activeItem} indicatorColor='primary' textColor='primary' centered>
        <Tab value='home' label='Home' component={Link} href='/' />
        <Tab value='posts' label='Posts' component={Link} href='/posts' />
        <Tab value='about' label='About' component={Link} href='/about' />
      </Tabs>
    </Paper>
  )
}
