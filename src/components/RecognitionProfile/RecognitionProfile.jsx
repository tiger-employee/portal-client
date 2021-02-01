import React, {useState, useEffect} from 'react'
import './recognition-profile.styles.scss'

const PostProfile = ({ user }) => {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    axios({
      url: `${apiUrl}/posts/`,
      method: 'GET',
      headers: {
        Authorization: `Token token=${user.token}`
      }
    })
      .then((res) => setPosts(res.data.posts))
  })

  const postsJSX = posts.map(post => {
    `<div>
      <div>
        ${post.createdAt}
      </div>
      <div>
        ${post.text}
      </div>
      <div>
        -- ${post.owner}
      </div>
    </div>`
  }) 
  return (
    <div className='post-container'>
      You have been recognized {posts.length} times.
      {postsJSX}
    </div>
  )
}

export default PostProfile