import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'
import Moment from 'react-moment'
import './feed.styles.scss'
import CreatePost from '../CreatePost/CreatePost.jsx'
import noProfileImage from '../../pages/UserProfile/no-photo-avail.jpg'

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios({
      url: `${apiUrl}/posts/`,
      method: 'GET',
      headers: {
        Authorization: `Token token=${user.token}`
      },
      params: {
        recipient: 'all',
        owner: 'all'
      }
    })
      .then((res) => setPosts(res.data.posts))
  }, [])

  const postsJSX = posts.map(post => {
    return (
      <div className='recognition-card' key={post._id}>
        <div className='recognition-card-header'>
          <Moment format="MM-DD-YYYY">{post.createdAt}</Moment>
        </div>
        <div className='recognition-card-text'>
          {post.text}
        </div>
        <div className='recognition-card-owner'>
          -{`${post.owner.firstName} ${post.owner.lastName}`}
        </div>
      </div>
    )
  })
  return (
    <div>
      <div className='feed-header'>
        <div className='image-holder'>
          {!user.profileImage ? <img src={noProfileImage} alt="image" className="profile-image-bigger"/> : <img src={user.profileImage} alt="image" className="profile-image-bigger"/>}
        </div>
        <CreatePost user={user}/>
      </div>
      {postsJSX}
    </div>
  )
}

export default Feed
