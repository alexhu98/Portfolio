# Server Side Rendering

##### June 12th, 2020 By Alex Hu

For Server Side Rendering, React has a StaticRouter instead of the BrowserRouter for the initial server side rendering.
That works well for the simple Hello World app where there no data to preload into the page. It gets more complicated as
soon you try to load real data into the page. In a Client-Side React app, all the data are loaded after the page is loaded.
With Server Side Rendering, now you have to load the data before the page is rendered in the server side AND also load
additional data on the client side especially if your app is a single page app.

[Using React Router 4 with Server-Side Rendering](https://alligator.io/react/react-router-ssr/)

The server side data loading portion feel like it is a afterthought of the whole architecture, but in fareness it is not
a bad way to convert existing React app to support Server Side Rendering. Since I am starting a new project, there is
no restriction on what I can use. So it opens up more possibility for a better framework for the job.

Static Site Generation seems to be back in fashion now and it makes sense to find a framework that can support both
Server Side Rendering as well as Static Site Generation.

### [Next.js](https://nextjs.org/)

Next.js quickly comes up as just the solution for both of them.

 - Next.js
 - Server Side Rendering
 - Static Site Generation
