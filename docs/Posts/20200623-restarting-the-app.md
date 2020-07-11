# Restarting the App
##### June 23rd, 2020 By Alex Hu

After looking through a number of frameworks, it is time to restart the app with [Next.js](https://nextjs.org/)
for the Server-Side Rendering, and [Apollo GraphQL](https://www.apollographql.com/) for the [GraphQL](https://graphql.org/)
server and client request.

The simple way to get get a Next.js started is to run create-next-app with the desired example template. I picked this
example as a starting point as it has all the hooks for Apollo server and client, along with some example codes to
calling useQuery and useMutation, and thje single sign up / sign in / sign out pages. Othen than those, it is bare bone
enough to experience the full back-end development.
```
npx create-next-app --example api-routes-apollo-server-and-client-auth
```



[MongoDB](https://www.mongodb.com/) hosted in by MongoDB [Altas](https://www.mongodb.com/cloud/atlas) in the cloud,
and MongoDB [Compass](https://www.mongodb.com/products/compass) for viewing the database.

[TypeScript](https://www.typescriptlang.org/) and [Semantic UI React](https://react.semantic-ui.com/) will be used on the
client side. The content will be entered the form of [Markdown](https://www.markdownguide.org/) using
[react-markdown](https://www.npmjs.com/package/react-markdown) as the UI component.

The Posts section will be built using the [Semantic UI's Card](https://react.semantic-ui.com/views/card/) component.

Each Post will have its own page hosting the Edit and Delete buttons. An Add button will be put in the Posts section.
