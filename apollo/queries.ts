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

export const CreateArticleMutation = gql`
  mutation CreateArticleMutation($title: String!, $summary: String!, $content: String!) {
    createArticle(input: { title: $title, summary: $summary, content: $content }) {
      article {
        title
        summary
        content
      }
    }
  }
`

export const UpdateArticleMutation = gql`
  mutation UpdateArticleMutation($id: String!, $title: String!, $summary: String!, $content: String!) {
    updateArticle(input: { id: $id, title: $title, summary: $summary, content: $content }) {
      title
      summary
      content
    }
  }
`

export const DeleteArticleMutation = gql`
  mutation DeleteArticleMutation($id: String!) {
    deleteArticle(input: { id: $id })
  }
`
