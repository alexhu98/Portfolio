# Node.js and Express
##### September 26th, 2020 By Alex Hu

After my advantage of Deno and abc

### [Node.js](https://nodejs.org/) and [Express](http://expressjs.com/)

Instead of setting up the Node.js / Express / TypeScript from scratch, I decided to start with this
[barebone minimalistic starter-kit for TypeScript-based ExpressJS app](https://github.com/soelinn/express-ts-starter) .
There are quite a few templates that generate more codes, but I like this barebone one as I am in a learning mode
and probably worth going through very basic, especially I started with Next.js which is very well structured.

### [Testing NodeJs/Express API with Jest and Supertest](https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6)

I want to try out the Jest testing framework and convert the test suites that I wrote in Deno.test() to test this Express server.
Once all the tests pass, then the job is done.

Typescript introduced a little bit of complexity in setting up the tests, but all is good following:
[Testing Typescript Api With Jest and Supertest](https://tutorialedge.net/typescript/testing-typescript-api-with-jest/)
and the hello test is as simple as
```js
import request from 'supertest'
import server from '../server'

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})

describe('request Hello', () => {
  it('Hello API Request', async () => {
    const result = await request(server).get('/')
    expect(result.status).toEqual(200)
    expect(result.text).toContain('Hello')
  })
})
```

Then there is an warning message after running the test:
```
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown.
Try running with --runInBand --detectOpenHandles to find leaks.
```
indicating that the server is still listening to the port. To gracefully quit the server, it is listening for
the /api/terminate GET command and terminate the server accordingly.
```js
const server = app.listen(port, () => console.log(`Starting ExpressJS server on Port ${port}`))

if (process.env.NODE_ENV === 'test') {
  app.get('/api/terminate', (req: Request, res: Response) => {
    res.send('Terminate...');
    server.close()
  })
}
```
Then all we have to do is tear down the server gracefully after all the tests.
```js
afterAll(async () => await request(server).get('/api/terminate'))
```
By the way, the NODE_ENV is setup via cross-env in package.json so you hooligan
don't come shutting down my server!
```
"test": "cross-env NODE_ENV=test jest",
```

I am using [BitBucket](https://bitbucket.org/) to host my Git repository. The have a feature call Pipeline to enable
[CI/CD](https://www.infoworld.com/article/3271126/what-is-cicd-continuous-integration-and-continuous-delivery-explained.html)
- Continuous Integration and Continuous Delivery. So every commit will run the build, just one way to keep myself honest.
