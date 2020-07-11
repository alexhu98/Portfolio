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

2. Oh, those lint/compiler errors! They remind me the early days of C++ where it is transpiled into C and then the C compiler
do the actual work. The error messages were very cryptic, until we got a native C++ compiler, but generic type made it worse again.
It is not helping that TypeScript has both of these features / problems.

Consider this perfectly fine Ramda code:
```js
const filterAndSortArticles = (articles: IArticle[]): IArticle[] => {
  return R.pipe(
    R.filter((article: IArticle) => ['Sprints', 'Posts'].includes(article.section)),
    R.sortBy(R.prop('id'))
  )(articles) as IArticle[]
}
```
and I don't even know where to start with these lint errors, except to @ts-ignore them away:
```
pages/index.tsx:84:5 - error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '<T>(list: readonly T[]) => T[]' is not assignable to parameter of type
     '(x: K extends (infer U)[] ? U[] : K extends Dictionary<infer U> ? Dictionary<U> : never) => IArticle[]'.
      Types of parameters 'list' and 'x' are incompatible.
       Type 'K extends (infer U)[] ? U[] : K extends Dictionary<infer U> ? Dictionary<U> : never' is not assignable to
        type 'readonly IArticle[]'.
         Type 'unknown[] | (K extends Dictionary<infer U> ? Dictionary<U> : never)' is not assignable to type 'readonly IArticle[]'.
          Type 'unknown[]' is not assignable to type 'readonly IArticle[]'.
           Type 'unknown' is not assignable to type 'IArticle'.
            Type 'IArticle[] | Dictionary<IArticle>' is not assignable to type 'readonly IArticle[]'.
             Type 'Dictionary<IArticle>' is missing the following properties from type 'readonly IArticle[]':
              length, concat, join, slice, and 18 more.

84     R.sortBy(R.prop('id'))
       ~~~~~~~~~~~~~~~~~~~~~~

  node_modules/@types/ramda/index.d.ts:1415:17
    1415 export function pipe<V0, V1, V2, T1, T2>(fn0: (x0: V0, x1: V1, x2: V2) => T1, fn1: (x: T1) => T2): (x0: V0, x1: V1, x2: V2) => T2;
                         ~~~~
    The last overload is declared here.

pages/index.tsx:85:5 - error TS2554: Expected 0 arguments, but got 1.

85   )(articles) as IArticle[]
       ~~~~~~~~

Found 2 errors.
```


3. Generic type is really hard to read! There is an example on strongly-typed GraphQL resolvers and queries using
[GraphQL code generator](https://graphql-code-generator.com/).
```
npx create-next-app --example with-typescript-graphql
```
The code generator creates a TypeScript file with 130 lines for the following GraphQL. I couldn't imagnine myself handwriting similar code full of nested generic types like that.
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

At one point, I was about the give up on TypeScript, but then I remember that this is a learning project.
I might as well give it a honest try and form a second option as the project mature.
