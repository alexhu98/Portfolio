import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/navbar'
import Dashboard from './components/dashboard/dashboard'
import StoryDetails from './components/projects/story-details'
import SignIn from './components/auth/sign-in'

const App = () => {
  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/story/:id' component={StoryDetails} />
          <Route path='/signin' component={SignIn} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
