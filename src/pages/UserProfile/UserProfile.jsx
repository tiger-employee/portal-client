import React from 'react'
import Quote from '../../components/Quote/Quote'
import BreakTimer from '../../components/BreakTimer/BreakTimer'
import Meditation from '../../components/Meditation/Meditation'

const Profile = ({ user }) => {
  return (
    <div>This is {user.email} profile page.
      <Quote/>
      <BreakTimer/>
      <Meditation/>
    </div>
  )
}

export default Profile
