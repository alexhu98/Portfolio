# Deno and abc
##### September 23rd, 2020 By Alex Hu

The mobile app is going to access a local server to run some operations on my main computer.
Although we can add additional API into the existing Portfolio Next.js app, I decided on the
a different server app since this local server is going to be run on my computer at home instead
of published in the web.

### [Deno](https://deno.land/)

Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8.
I very much prefer the async / await that it offers. Not to mention that it is new and shiny.
However, like most new framework, it is less refine. For example, it takes some workaround
to get Ramda working, noting that the 3rd Party Ramda model in deno.land does not work for me.

```js
import { createRequire } from 'https://deno.land/std/node/module.ts'
const require = createRequire(import.meta.url)
export const R = require('ramda')
```

### [abc](https://deno.land/x/abc)

Similar to Express for Node.js, abc is a Deno framework to create web application.
I briefly tried [Oak](https://deno.land/x/oak) but was having problems with the RouterContext
and json parsing in the POST request body

Overall, it is quite easy to work with, and the boilerplate code is kept to a minimum.

### [Deno.test](https://deno.land/manual/testing)

Writing end-to-end test is easy enough. I have the server running in one terminal using, and have the test running on another terminal.
I use [denon](https://deno.land/x/denon) which is the deno replacement for nodemon, that automatically restart the deno project upon changes
in source code.

Deno.test() is quite similar to other test framework, for example:

```js
Deno.test('browse', async () => {
  await waitForServerToStart()
  const response = await fetch(getMediaApi())
  const result = await response.json()
  assertNotEquals(result.length, 0)
  const folder: MediaFolder = result[0]
  console.log(folder)
  assertStringContains(folder.url, 'stream')
  assertEquals(folder.name, 'stream')
  assert(folder.url.indexOf(' ') < 0, 'No space in url allowed')
})
```

The drawback of having server running on another terminal is that the tests could have started before the server is fully compiled and
may not be up and running. So I inserted a little bit of code in the beginning of each test to retry until the the server is start.

```js
const waitForServerToStart = async () => {
  let retryCount = 0
  while (retryCount++ < 10) {
    try {
      const response = await fetch(getMediaApi())
      console.log(`waitForServerToStart -> ${response.status}`)
      await response.json()
      if (response.ok) {
        return
      }
    }
    catch (ex) {
    }
  }
}
```
