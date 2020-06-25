import { Button, Container, Menu } from 'semantic-ui-react'

type Props = {
  activeItem?: string
}

export const NavBar = ({ activeItem }: Props) => {
  return (
    // <Menu pointing secondary inverted={true} color='red'>
    <Menu pointing secondary inverted={false} color='black'>
      <Container>
        <Menu.Item icon='home' name='home' href='/' active={activeItem === 'home'} />
        <Menu.Item icon='box' name='blog' active={activeItem === 'blog'} href='/blog' />
        <Menu.Item icon='address book' name='about' active={activeItem === 'about'} href='/about' />
        <Menu.Item position='right'>
          <Button>Log In</Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}
