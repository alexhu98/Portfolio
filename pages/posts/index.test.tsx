import React from 'react'
import { render } from '@testing-library/react'
import Footer from '../../components/Footer'


describe('Posts/index.tsx', () => {
  it('true be true', () => {
    expect(true).toBe(true)
  })
  it('renders correctly', () => {
    // const { queryByTestId, queryByPlaceholderText } = render(<Footer />)
    const { queryByTestId } = render(<Footer />)
    expect(queryByTestId('footer-divider')).toBeTruthy()
  })
})


// describe('Provider', () => {

// })