import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'

type Props = {
  activeItem: string
}

export const NavBar: React.FC<Props> = ({ activeItem }) => {
  return (
    // <Menu pointing secondary inverted={true} color='red'>
    <Menu pointing secondary inverted={false} color='black'>
      <Container>
        <Menu.Item icon='home' name='home' href='/' active={activeItem === 'home'} />
        <Menu.Item icon='box' name='posts' active={activeItem === 'posts'} href='/posts' />
        <Menu.Item icon='address book' name='about' active={activeItem === 'about'} href='/about' />
        <Menu.Item position='right'>
          <Button>Log In</Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}
