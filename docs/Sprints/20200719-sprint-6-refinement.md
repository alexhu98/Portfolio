# Sprint 6 Refinement
##### July 19th, 2020 By Alex Hu

### Animation ✔

Animation soften up the user interface a bit. Even a short duration of animation will ease the harsh
feeling of sudden pop in and out of hover style.

### Minimizing File Size ✔

One of the side effect of adding the back / next buttons is that too much data is loaded in the query.
As the return value of getStaticProps() become the static content inside the generated static html,
we can do all the calculation in the getStaticProps() and just return the necessary information, in this
case, all I need are the href for the back and next buttons and the article for the page. Prevoiusly,
I was returning all the articles even through only a single article is being shown. This reduces the
file size from 80K to only 8K bytes.
```js
export const getStaticProps: GetStaticProps = async (context: Context) => {
  ...
  return {
    props: {
      backHref,
      nextHref,
      article,
    }
  }
}
```

### Material-UI Styles

The FOUC problem is still bugging me a bit. Let's explore if CSS-in-JS will solve the problem.
