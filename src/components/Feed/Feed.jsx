import React, { useState } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig.js'
import './feed.styles.scss'
// import { Editor } from '@tinymce/tinymce-react'

const Feed = ({ user }) => {
//   const [posts, setPosts] = useState({})
  const [newPost, setNewPost] = useState({})
  const [postId, setPostId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    axios({
      url: `${apiUrl}/posts/`,
      method: 'POST',
      headers: {
        Authorization: `Token token=${user.token}`
      },
      data: { newPost }
    })
      .then((res) => setPostId(res.data.post._id))
      .then(() => setNewPost({}))
      .then(() => console.log(postId + ' created succesfully'))
  }

  const handleEditorChange = (e) => {
    e.persist()
    setNewPost((prevMessage) => {
      const updatedMessage = { [e.target.name]: e.target.value }
      const editedMessage = Object.assign({}, prevMessage, updatedMessage)
      return editedMessage
    })
  }

  //   useEffect(() => {
  //     setPosts([...messageArray, message])
  //   }, [])

  return (
    <div>This is the feed, <div>{newPost.text}</div>
      <div className='new-message-form'>
        <form id='feed-text' onSubmit={handleSubmit}>
          <h2>Recognize a coworker!</h2>
          <label>Message</label>
          <textarea className='input-post' onChange={handleEditorChange} name="text" required></textarea>
          <label>Recipient:  </label>
          <input className='input-recipient' name="recipient" onChange={handleEditorChange} required></input>
          <button type='submit'>Recognize {newPost.recipient}</button>
        </form>
      </div>
    </div>
  )
}

export default Feed
