import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

const Feed = (props) => {
//   const [posts, setPosts] = useState({})
  const [newPost, setNewPost] = useState('')

  //   useEffect(() => {
  //     setPosts([...messageArray, message])
  //   }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(newPost)
    setNewPost('')
  }

  const handleEditorChange = (e) => {
    console.log(
      'Content was updated:',
      e.target.value
    )
    const receivedPost = e.target.getContent()
    setNewPost(receivedPost)
  }
  console.log(props.user)
  return (
    <div>This is the feed, <div dangerouslySetInnerHTML={{ __html: newPost }}></div>
      <form id='feed-text' onSubmit={handleSubmit}>
        <Editor
          apiKey= {process.env.REACT_APP_APIKEY}
          value= {newPost}
          init={{ height: 150,
            menubar: false,
            plugins: [
              'advlist autolink lists link image',
              'charmap print preview anchor help',
              'searchreplace visualblocks code',
              'emoticons',
              'insertdatetime media table paste wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | emoticons | help'
          }}
          onChange = {handleEditorChange}
        />
        <input type='submit' value='submit'/>
      </form>
    </div>
  )
}

export default Feed
