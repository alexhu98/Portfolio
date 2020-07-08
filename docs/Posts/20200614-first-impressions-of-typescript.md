# First Impressions of TypeScript

##### June 14th, 2020 By Alex Hu

***I don't like her***, for her kept complaining about my *type!*

Well, what can I say. That was my first impressions of TypeScript.

Don't get me wrong, I have been using strongly-typed programming languages for many years, including Java, C++
and C. Then I picked up Python and JavaScript a few years ago and I didn't miss the types a bit, there are a lot
less keystrokes to get the job done. You do need a strong discipline of running through the code for coverage,
which is not a problem for me as I usually run through my new code line by line with a debugger, but those
catch blocks always got me so I make it a rule to test them by throwing exception intentionally to test them.

And then there is Kotlin, it is a strongly-typed language. I remember liking it immediately, although in many ways
it is even stricter than Java with it Null Safety check. How strange! I actually rewrited a Java Android app
developped back from the Gingerbread and bring it up to date all the way to Android 10 and it was a pleasure to work it.
So it is not the types I have problems with.

Okay, back to TypeScript. There are a lot of writing on the [Pros and Cons of TypeScript](https://www.altexsoft.com/blog/typescript-pros-and-cons/).
For me, these are the things that make it hard to like,

1. It has a habit of complicating things, turning something like this
```js
const handleOK = (event) => {
  event.preventDefault()
  ...
}
```
into this:
```js
const handleOK = (event: React.MouseEvent<HTMLButtonElement>
                       | React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  ...
}
```
Come on, this is a bit much. The damn thing is so long that it doesn't fit into a single line any more!
And it is much less readable than the JavaScript version.

2. Oh, those compiler errors! They remind me the early days of C++ where it is transpiled into C and then the C compiler
do the actual work. The error messages were very cryptic, until we got a native C++ compiler, but generic type made it worse again.
It is not helping that TypeScript has both of these features / problems.

```
 /// SOME EXAMPLE COMPILER ERORR ///
```

3.

Here is an example on strongly type the GraphQL resolvers and queries using [GraphQL code generator](https://graphql-code-generator.com/).
```
npx create-next-app --example with-typescript-graphql
```
The code generator create a TypeScript file with 130 lines for the following GraphQL. I couldn't imagnine myself handwriting similar code.
```
type Mutation {
  createStory(description: String!, title: String!): Story!
  updateStory(description: String, title: String, id: Int!): Story!
  deleteStory(id: Int!): Boolean!
}

type Query {
  hello: String!
  stories: [Story!]!
}

type Story {
  id: Int!
  title: String!
  description: String!
}
```

At one point, I was about the give up on TypeScript, but then I remember that this is a learning project. I might as well give it a honest try
and form a second option as the project mature.
