import React, { useState } from 'react'
// import { Editor } from '@tinymce/tinymce-react'

const Feed = (props) => {
//   const [posts, setPosts] = useState({})
  const [newPost, setNewPost] = useState('')

  //   useEffect(() => {
  //     setPosts([...messageArray, message])
  //   }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(newPost)
    setNewPost(e.target.value)
  }

  const handleEditorChange = (e) => {
    console.log(
      'Content was updated:',
      e.target.value
    )
    const receivedPost = e.target.value
    setNewPost(receivedPost)
  }
  console.log(props.user)
  return (
    <div>This is the feed, <div>{newPost}</div>
      <form id='feed-text' onSubmit={handleSubmit}>
        <textarea className='input-post' onChange={handleEditorChange}></textarea>
        <input className='input-recipient'></input>
      </form>
    </div>
  )
}

export default Feed
