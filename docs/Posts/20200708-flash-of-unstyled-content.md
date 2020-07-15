# Flash of Unstyled Content
##### July 8th, 2020 By Alex Hu

I was not happy with the
[Flash of Unstyled Content](https://www.techrepublic.com/blog/web-designer/how-to-prevent-flash-of-unstyled-content-on-your-websites/)
(FOUC) problem. The unstyled content shows its ugly head with the timeline component. Just imagine the
[vertical timeline](https://uicookies.com/vertical-timeline/) got mushed together at the left edge of the screen!

Forunately, we can get rid of the problem by setting visibility to 'hidden' on the outer Layout wrapper initially,
then removed it when the page is rendered with a useEffect(). It starts with a simple 'fouc' class in the css file.
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
