import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'
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
  const postsJsx = posts.map(post => {
    return (
      <div key={post._id}>
        {post.createdAt} <br/>
        {post.text}
      </div>
    )
  })
  return (
    <div>This is the feed
      {postsJsx}
    </div>
  )
}

export default Feed
