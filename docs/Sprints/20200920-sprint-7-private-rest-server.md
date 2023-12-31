# Sprint 7 Private REST Server
##### September 20th, 2020 By Alex Hu

Goal: Create a private REST server at home to serve up some media files, as well as
performing operations on my computer when requested by a new peronal assistant mobile app.

### Deno & abc ✔

[Deno Course - Better than Node.js?](https://www.youtube.com/watch?v=TQUy8ENesGY)
[Deno Jump-start Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gnaJdxuGvEGYQ9iHb8mxsh)

### Node.js & Express ✔

[How to build a REST API with Node js & Express](https://www.youtube.com/watch?v=pKd0Rpw7O48)

### My Impression on Deno and Node.js

Overall, the Node.js & Express experience has been smoother and definitely more refined. Things
work just as it advertised. I do miss the native async / await support in Deno, but a quick
[util.promisify()](https://masteringjs.io/tutorials/node/promisify) converted the callback functions
into Promise without problem. For the fs module, there is already a promisified module called fs.promises
which async / await calls quite painless.
