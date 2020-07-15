import React from 'react'
import { Divider } from '@material-ui/core'

const Footer = () => {
  // return null
  return (
    <footer>
      <Divider data-testid='footer-divider' />
      <div className='copyright-legal'>
        <small className='copyright'>&copy; Alex Hu</small>
        <small className='contact-me'><a href='mailto:alexhu98@hotmail.com'>Contact Me</a></small>
        <small className='legal'><a href='/legal.html'>Privacy &amp; Terms</a></small>
      </div>
    </footer>
  )
}

export default Footer
