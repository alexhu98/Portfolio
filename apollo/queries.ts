import gql from 'graphql-tag'

export const ArticlesQuery = gql`
  query ArticlesQuery {
    articles {
      id
      title
      summary
      content
    }
  }
`

export const ArticleQuery = gql`
  query ArticleQuery($id: String!) {
    article(id: $id) {
      id
      title
      summary
      content
    }
  }
`
