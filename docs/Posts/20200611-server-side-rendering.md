# Server Side Rendering
##### June 11th, 2020 By Alex Hu

For [Server Side Rendering, React has a StaticRouter](https://alligator.io/react/react-router-ssr/)
instead of the Client-Side BrowserRouter.

That works well for the simple Hello World app with no data to preload into the page. It gets more complicated as
soon as you try to load real data into the page. In a Client-Side React app, all the data are loaded after the page is loaded.
With Server Side Rendering, you have to load the data before the page is rendered in the server side *and* also load
additional data on the client side especially if your app is a single page app. In the worst case, you will have to implement
the data fetching logic twice, once on the server side and again on the client side.

The server side data fetching portion feel like it is a afterthought of the whole architecture, but in fareness it is not
a bad way to convert existing React app to support Server Side Rendering. Since I am starting a new project, there is
no restriction on what I can use. So it opens up more possibility for a better framework for the job.

[Static Site Generation](https://dev.to/matfrana/server-side-rendering-vs-static-site-generation-17nf)
seems to be back in fashion now and it makes sense giving that a lot of the article pages are static
instead of highly interactive. So finding a framework that can support and mix-and-match both Server Side Rendering
and Static Site Generation would be ideal.

[**Next.js**](https://nextjs.org/) quickly comes up as just the solution for both of them, and it has an active community behind it.
```
npx create-next-app
```
will create a skeleton app to get you started.