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
          -- ${post.owner}
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
