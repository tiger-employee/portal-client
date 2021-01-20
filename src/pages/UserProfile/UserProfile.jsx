import React from 'react'
import Quote from '../../components/Quote/Quote'
import BreakTimer from '../../components/BreakTimer/BreakTimer'
import Mediation from '../../components/Meditation/Meditation'

const Profile = ({ user }) => {
  return (
    <div>This is {user.email} profile page.
      <Quote/>
      <BreakTimer/>
      <Mediation/>
    </div>
  )
}

export default Profile
