import React, { useState } from 'react'
// import { Editor } from '@tinymce/tinymce-react'

const Feed = (props) => {
//   const [posts, setPosts] = useState({})
  const [newPost, setNewPost] = useState({})

  //   useEffect(() => {
  //     setPosts([...messageArray, message])
  //   }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(newPost)
    setNewPost(e.target.value)
  }

  const handleEditorChange = (e) => {
    e.persist()
    setNewPost((prevMessage) => {
      const updatedMessage = { [e.target.name]: e.target.value }
      const editedMessage = Object.assign({}, prevMessage, updatedMessage)
      return editedMessage
    })
  }
  console.log(props.user)
  return (
    <div>This is the feed, <div>{newPost.text}</div>
      <form id='feed-text' onSubmit={handleSubmit}>
        <h2>Recognize a coworker!</h2>
        <label>Message</label>
        <textarea className='input-post' onChange={handleEditorChange} name="text" required></textarea>
        <label>Recipient:  </label>
        <input className='input-recipient' name="recipient" required></input>
      </form>
    </div>
  )
}

export default Feed
