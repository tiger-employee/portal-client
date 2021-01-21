import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'
import Quote from '../../components/Quote/Quote'
import BreakTimer from '../../components/BreakTimer/BreakTimer'
import Meditation from '../../components/Meditation/Meditation'

const Profile = ({ user }) => {
  const [meditations, setMeditations] = useState([])

  useEffect(() => {
    axios({
      url: `${apiUrl}/meditations/`,
      method: 'GET',
      headers: {
        Authorization: `Token token=${user.token}`
      }
    })
      .then((res) => setMeditations(res.data.meditations))
  }, []
  )

  return (
    <div className='profile-container'>{user.email} profile page.
      You have meditated {meditations.length} times.
    <Quote/>
    <BreakTimer/>
    <Meditation user={user}/>
    </div>
  )
}

export default Profile
