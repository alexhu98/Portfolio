const Enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

Enzyme.configure({adapter: new Adapter()})

process.env.TEST_HOST = 'http://localhost:3000'
