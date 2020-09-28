# Node.js and Express
##### September 26th, 2020 By Alex Hu

After my advantage of Deno and Abc, I decided to give Node.js and Express a try, and give them fair comparison.
Next.js has been a big help in getting this site up and running. This time, I want to use setup a simple private
server that I can run at home to support a peronal assistant.

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

describe('request Hello', () => {
  it('Hello API Request', async () => {
    const result = await request(server).get('/api/hello')
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

### [Continuous Integration and Continuous Delivery](https://www.infoworld.com/article/3271126/what-is-cicd-continuous-integration-and-continuous-delivery-explained.html)

I am using [BitBucket](https://bitbucket.org/) to host my Git repository. The have a feature call Pipeline to enable
[CI/CD](https://www.infoworld.com/article/3271126/what-is-cicd-continuous-integration-and-continuous-delivery-explained.html)
Continuous Integration and Continuous Delivery. So every commit will run the build, just one way to keep myself honest.

### [async / await](https://javascript.info/async-await)

In order to use the async / await for the fs module, you can use the fs.promises module instead.
For example, you can call fs.promises.stat() function like this if you want to have a convenient
exists() function.

```js
import cp from 'fs'

const fsp = fs.promises

export const exists = async (path: string): Promise<boolean> => {
  try {
    await fsp.stat(path)
    return true
  }
  catch (ex) {
  }
  return false
}
```

For the child_process module, you can wrap the function with the util.promisify() utility function.

```js
import cp from 'child_process'
import util from 'util'

const execFile = util.promisify(cp.execFile)

const moveAllFiles = async () => {
  try {
    await execFile(MOVE_ALL_COMMAND)
  }
  catch (ex) {
  }
}
```

A couple of things that you need to watch out for:

1. only the happy path will continue after the await, the error path will be thrown as an exception.
So the exists() wrapper above is catching file not found as an exception.

2. looping a bit more tricky. If you are use to forEach, then you are in for a
[big surprise](https://zellwk.com/blog/async-await-in-loops/).
This [asyncForEach](https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404)
seems to be a good wrapper around the loop if you want to keep your code as close as before.
```js
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
```
You can use this wrapper function as follows:
```js
asyncForEach([1, 2, 3], async (num) => {
  await waitFor(50)
  console.log(num)
})
```

3. [async map](https://stackoverflow.com/questions/53269920/javascript-promise-all-and-async-await-and-map)
also need some TLC as well. You just need to be aware of it. This is where having strong end-to-end tests
will help a lot.
