# Fade Out / Fade In Article
##### July 9th, 2020 By Alex Hu

A little fade-out / fade-in transitions won't hurt when the user switches article by clicking around on the timeline.

1. fade out
2. listen for the [onExited](http://reactcommunity.org/react-transition-group/transition) event
3. switch the data
4. fade in
```js
const Index = () => {
  // ...
  const [selectedArticle, setSelectedArticle] = useState()
  const [fadeInArticle, setFadeInArticle] = useState()
  const [fadeIn, setFadeIn] = useState(true)

  const handleTitleClick = (e: React.MouseEvent<HTMLElement>, article: IArticle) => {
    e.preventDefault()
    fadeArticle(article)              // start the fade out / fade in sequence
  }

  const fadeArticle = (article: IArticle) => {
    if (article !== selectedArticle) {
      setFadeInArticle(article)       // remember the article to be faded in
      setFadeIn(false)                // trigger the fade out, then wait for onExited
    }
  }

  const handleFadeExited = () => {
    setSelectedArticle(fadeInArticle) // set the article
    setFadeIn(true)                   // trigger the fade in
  }

  return (
    // ...

    // set the transition timeout duration to 150 milliseconds for
    // each half of the fade-out / fade-in transitions
    <Fade in={fadeIn} timeout={150} onExited={handleFadeExited} >
      <Paper>
        <ArticlePanel article={selectedArticle} />
      </Paper>
    </Fade>
  )
}
```
