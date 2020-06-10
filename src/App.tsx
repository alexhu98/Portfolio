import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/projects/Dashboard'
import Story from './components/projects/Story'
import SignIn from './components/auth/SignIn'

const App = () => {
  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/story/:id' component={Story} />
          <Route path='/signin' component={SignIn} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
