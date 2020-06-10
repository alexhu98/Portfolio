import React from 'react'
import Notifications from './Notifications'
import Project from './Project'

const Dashboard = () => {
  return (
    <div className='dashboard container'>
      <div className='row'>
        <div className='col s12 m6'>
          <Project />
        </div>
        <div className='col s12 m5 offset-m1'>
          <Notifications />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
