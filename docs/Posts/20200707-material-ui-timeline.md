# Material-UI Timeline
##### July 7th, 2020 By Alex Hu

The [Material-UI Timeline](https://material-ui.com/components/timeline/) component is just the
user interface to provide an outline of development progress. It puts a
[vertial timeline](https://uicookies.com/vertical-timeline/) in the center of the page
leaving a lot of white space on both side of it. I tried putting the article content
to fill those white spaces, but they make a big bad long scrolling page.

At the end, only the article title are placed at the timeline and the article is shown in a
[Dialog](https://material-ui.com/components/dialogs/) that
[slide up](https://material-ui.com/components/dialogs/#transitions) from the bottom.

Since I am using the [Material-UI Timeline](https://material-ui.com/components/timeline/) component,
I might as well replace all the [Semantic-UI-React](https://react.semantic-ui.com/) components with
the correponding ones in [Material-UI](https://material-ui.com/). Beside some minor differences,
the conversion process went quite smoothly.

The timeline component has too much white space so I decided to tighten it up a bit putting it on
the left side of the screen, and show the selected article at the right side of the screen.
The screen is also made responsive for smartphone screen to only show the timeline but not the article.
