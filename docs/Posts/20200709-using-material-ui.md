# Using Material-UI

##### July 09th, 2020 By Alex Hu

Since I am using the [Material-UI Timeline](https://material-ui.com/components/timeline/) component,
I might as well replace all the [Semantic-UI-React](https://react.semantic-ui.com/) components with
the correponding ones in [Material-UI](https://material-ui.com/). Beside some minor differences,
the conversion process went quite smoothly.

The timeline component has too much white space so I decided to tighten it up a bit putting it on
the left side of the screen, and show the selected article at the right side of the screen.
The screen is also made responsive to only timeline with out the article for phone size display.

These visual effects are nice touch to the user experience:

### [Fade](https://material-ui.com/api/fade/) Out / In Article

A little fade out / fade in transitions won't hurt when the user switch article when clicking around on the timeline.
The key is to fade out, then listen for the [onExited](http://reactcommunity.org/react-transition-group/transition) event.
Afterwards, you can switch out the data and fade it back in.
```js
const Index = () => {
  // ...
  const [selectedArticle, setSelectedArticle] = useState()
  const [fadeInArticle, setFadeInArticle] = useState()
  const [fadeIn, setFadeIn] = useState(true)

  const handleTitleClick = (e: React.MouseEvent<HTMLElement>, article: IArticle) => {
    e.preventDefault()
    fadeArticle(article)
  }

  const fadeArticle = (article: IArticle) => {
    if (article !== selectedArticle) {
      setFadeInArticle(article)       // remember the article we are waiting to be faded in
      setFadeIn(false)                // trigger the fade out, then wait for onExited
    }
  }

  const handleFadeExited = () => {
    setSelectedArticle(fadeInArticle) // set the article
    setFadeIn(true)                   // trigger the fade in
  }

  return (
    // ...

    // set the transition timetout duration to 150 milliseconds which
    // is half for each of the fade-out / fade-in transitions
    <Fade in={fadeIn} timeout={150} onExited={handleFadeExited} >
      <Paper className='article-paper'>
        <ArticlePanel article={selectedArticle} />
      </Paper>
    </Fade>
  )
}
```

### [Flash of Unstyled Content](https://www.techrepublic.com/blog/web-designer/how-to-prevent-flash-of-unstyled-content-on-your-websites/)

I was not happy with the FOUC problem. Expecially when the timeline component, the unstyled content
shows its ugly head, just imagine the a vertical timeline that get mushed together at the left edge
of the screen! Forunately, we can get rid of it by setting visibility to 'hidden' on the outer Layout
wrapper initially, then removed it when the page is rendered using useEffect().

It starts with a simple 'fouc' class in the css file.
```css
// index.css
.fouc {
  visibility: hidden;
}
```
Then in the Layout component, useEffect() can remove the 'fouc' class from the outer component.
```js
const Layout: React.FC<PropsWithChildren<Props>> = ({ children, title, activeItem }) => {
  // avoid Flash of Unstyled Content by hiding all contents initially
  // then make it visible once loaded
  const [foucClassName, setFoucClassName] = useState('fouc')

  useEffect(() => {
    setFoucClassName('')
  }, [])

  return (
    <div className={foucClassName}>
      <Head>
        <title>{ title }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400&display=swap' />
      </Head>
      <NavBar activeItem={activeItem} />
      {children}
      <Footer />
    </div>
  )
}
```
