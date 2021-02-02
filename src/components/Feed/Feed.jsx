import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'
import Moment from 'react-moment'
import './feed.styles.scss'

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
        recipient: 'all'
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
    <div>This is the feed
      {postsJSX}
    </div>
  )
}

export default Feed
