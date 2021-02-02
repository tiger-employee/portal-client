import React, { useState, useEffect } from 'react'
import './post-profile.styles.scss'
import Moment from 'react-moment'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'

const PostProfile = ({ user }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios({
      url: `${apiUrl}/posts/`,
      method: 'GET',
      headers: {
        Authorization: `Token token=${user.token}`
      },
      params: {
        user: user._id
      }
    })
      .then((res) => setPosts(res.data.posts))
  }, [])

  const postsJSX = posts.map(post => {
    return (
      <div key={post._id}>
        <Moment format="MM-DD-YYYY">
          <div>
            {post.createdAt}
          </div>
        </Moment>
        <div>
          {post.text}
        </div>
        <div>
          -{`${post.owner.firstName} ${post.owner.lastName}`}
        </div>
      </div>
    )
  })

  return (
    <div className='post-container'>
      You have been recognized {posts.length} times.
      {posts ? postsJSX : 'You have no recognitions yet.'}
    </div>
  )
}

export default PostProfile
