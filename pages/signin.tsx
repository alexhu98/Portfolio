import React from 'react'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { getErrorMessage } from '../lib/form'
import Field from '../components/field'

const SignInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`

function SignIn() {
  const client = useApolloClient()
  const [signIn] = useMutation(SignInMutation)
  const [errorMsg, setErrorMsg] = useState()
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // @ts-ignore
    const emailElement = event.currentTarget.elements.email
    // @ts-ignore
    const passwordElement = event.currentTarget.elements.password

    try {
      await client.resetStore()
      const { data } = await signIn({
        variables: {
          email: emailElement.value,
          password: passwordElement.value,
        },
      })
      if (data.signIn.user) {
        await router.push('/')
      }
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
    }
  }

  return (
    <>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        { errorMsg ? <p>{errorMsg}</p> : null }
        <Field
          name='email'
          type='email'
          autoComplete='email'
          required
          label='Email'
        />
        <Field
          name='password'
          type='password'
          autoComplete='password'
          required
          label='Password'
        />
        <button type='submit'>Sign in</button> or{' '}
        <Link href='signup'>
          <a>Sign up</a>
        </Link>
      </form>
    </>
  )
}

export default SignIn
