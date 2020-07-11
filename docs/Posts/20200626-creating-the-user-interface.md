# Creating the User Interface
##### June 26th, 2020 By Alex Hu

### [Semantic UI React](https://react.semantic-ui.com/)

The [Menu](https://react.semantic-ui.com/collections/menu/#types-secondary-pointing)
component is used for the navigation bar. There are many variations and I decided on
the one that underline the active item.
```
<Menu pointing secondary>
```

### [Semantic UI's Card](https://react.semantic-ui.com/views/card/)

The Posts section used the
[Card component in a 2 columns group](https://react.semantic-ui.com/views/card/#types-group-props)
with a Add [button](https://react.semantic-ui.com/elements/button/) to create new post.

### [Markdown](https://www.markdownguide.org/)

Individual Post has Edit and Delete buttons for the corresponding actions.
The content are entered as Markdown using
[react-markdown](https://www.npmjs.com/package/react-markdown) as the UI component.
```js
import ReactMarkdown from 'react-markdown'
//...
<ReactMarkdown source={article.content} />
```
