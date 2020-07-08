# Start and Stop

##### June 10th, 2020 By Alex Hu

Today is a quick start with [create-react-app](https://github.com/facebook/create-react-app)
with [scss](https://sass-lang.com/) and a little bit of [Materialize css](https://materializecss.com/).
All smooth sailing until...

I learned about [the importance of Server-Side Rendering](https://stackonfire.com/scraping-server-side-rendered-react-apps/)
for search enghine. Oh boy, got my brian all wrecked up. Well, this thing is just not going to work with a normal
create-react-app fetching data after the page source is loaded. Search engines are just not going to find the page content
a real human would see. So all my client side skill for single page app would need to be throw out the window.

Quite a few questions rushed into my head when I realized the complexity of the problem:

 * Does it mean I have to server side generate the page using some sorts of templating? I worked with the Python
[Django](https://www.djangoproject.com/) server side [templates](https://docs.djangoproject.com/en/3.0/topics/templates/)
before, but it would just take the fun out of the whole project.

 * What about the rich client side interactive that we are accustom to over the years?

 * Does it mean I would need to use Client-Side React along with server side rendering templates? How would that work!

Fortunately, [React Server-Side Rendering](https://www.digitalocean.com/community/tutorials/react-server-side-rendering)
came to the rescue, by rendering the virtual DOM on the server side and then populating the page content as part of the page source.
The React app can still work the same afterwards by fetching additional data when navigating to another page and so on.
It was a sigh of relief when the smart community has already solved the problem.

By the way, I was also wrong on search engine not able to read page content for Client-Side React app. Google has tools like
[Puppeteer](https://developers.google.com/web/tools/puppeteer/) and [Fetch as Goolge](https://www.javascriptstuff.com/react-seo/)
that wait for Client-Side React app to be fully loaded before scraping the page. Unforunately,
[Google might not see the page content](https://blog.pusher.com/seo-react-fetch-as-google/) if the data took a while to be fetched.
