# Static Markdown Files on the Server
##### July 5th, 2020 By Alex Hu

As it turns out, this project does not need a database for the articles. There are actually
static site generators, like [MkDocs](https://www.mkdocs.org/user-guide/writing-your-docs/),
that accept Markdown files and generates the whole site just from the files.

### Static Markdown files on the Server

I use similar file layout as in [MkDocs](https://www.mkdocs.org/user-guide/writing-your-docs/#file-layout)
where *docs* is the parent folder of the articles. The subfolder under docs are *Posts* and *Sprints*
and these folder names become the section name of the articles. The file name starts with a timestamp followed by
the article id, which is a slug of the title. For example, the full path of this article is
*docs/Posts/20200705-static-markdown-files-on-the-server.md*.

With the file layout defined, all it took was to change the GraphQL resolvers to read from the files
instead of the database. Since GraphQL implementation is completely decoupled from the client,
it makes the switch easy.
```
docs/
  Posts/
    20200608-a-new-beginning.md
    20200610-start-and-stop.md
    ...
    20200705-static-markdown-files-on-the-server.md
  Sprints/
    20200609-sprint-1-gearing-up
    20200615-sprint-2-deciding-on-a-framework.md
    ...
    20200704-sprint-5-user-interface-improvement.md

```
These folders are under the project's root folder and are checked into Git Repository, along with the code,
and therefore provide a safe archive for the documents.

### Enter Articles with Markdown files

The first 2 lines of the Markdown files always start with a H1 title and a H5 timestamp.
This allows the resolvers to parse the Markdown files for the article title.
The H5 allows the timestamp to be styled through normal CSS.

```
# Static Markdown Files on the Server
##### July 5th, 2020 By Alex Hu
```

### Automatic Refresh

There are quite a bit of markdown files to edit. It would be nice to have the page
content automatically refresh as the markdown files are changed. The
[Apollo useQuery hook](https://www.apollographql.com/docs/react/api/react-hooks/)
supports a *pollInterval* option, so we just have to update the page when useQuery
returns new data. Note that Apollo cache the data and only trigger the change only
when necessary.
```js
const POLLING_INTERVAL = process.env.NODE_ENV === 'production' ? 0 : 2000

const { data } = useQuery<ArticlesResult>(ArticlesQuery, {
  pollInterval: POLLING_INTERVAL,
})
const [articles, setArticles] = useState(() => filterAndSortArticles(data?.articles))

useEffect(() => {
  setArticles(filterAndSortArticles(data?.articles))
}, [data])
```
