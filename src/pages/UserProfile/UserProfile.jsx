import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'
import Quote from '../../components/Quote/Quote'
import BreakTimer from '../../components/BreakTimer/BreakTimer'
import Meditation from '../../components/Meditation/Meditation'
import './user-profile.styles.scss'
import S3FileUpload from 'react-s3'

const Profile = ({ user }) => {
  const [meditations, setMeditations] = useState([])
  const [getImage, setGetImage] = useState()

  const secret = process.env.REACT_APP_SECRET_KEY
  const access = process.env.REACT_APP_ACCESS_KEY

  const config = {
    bucketName: 'employee-portal-profile-image',
    region: 'us-east-2',
    secretAccessKey: secret,
    accessKeyId: access
  }

  const onFileChange = event => {
    S3FileUpload.uploadFile(event.target.files[0], config)
      .then((data) => {
        setGetImage(data.location)
        return axios({
          url: `${apiUrl}/users/${user._id}`,
          method: 'PATCH',
          headers: {
            'Authorization': `Token token=${user.token}`
          },
          data: {
            profileImage: data.location
          }
        })
      })
      .catch((err) => {
        alert(err)
      })
  }

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
      <form id='image-upload'>
        {getImage ? <img src={getImage} alt="image" className="profile-image"/> : ' '}You have meditated {meditations.length} times.
        <input type="file" onChange={onFileChange} />
      </form>
      {user.profileImage ? <img src={user.profileImage} alt="image" className="profile-image"/> : ' '}
      <Quote/>
      <BreakTimer/>
      <Meditation user={user}/>
    </div>
  )
}

export default Profile
