# Unit Testing with Jest
##### June 30th, 2020 By Alex Hu

### [Jest](https://jestjs.io/)

There are many articles written on the topic. So a simple self test is not difficult.
```js
describe('Jest self test', () => {
  it('true be true', () => {
    expect(true).toBe(true)
  })
})
```
### [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

The React Testing Library allows the page to be rendered and perform test on the resulting DOM.
In this case, we just check for the existance of a footer-divider:
```js
describe('About page', () => {
  it('About render correctly', () => {
    const result = render(<About />)
    const { queryByTestId } = result
    expect(queryByTestId('footer-divider')).toBeTruthy()
  })
})
```
And the Footer.tsx has ```data-testid='footer-divider'``` in it to allow for the test.
```js
import React from 'react'
import { Divider } from 'semantic-ui-react'

const Footer = () => {
  return (
    <footer>
      <Divider data-testid='footer-divider' />
    </footer>
  )
}

export default Footer
```
