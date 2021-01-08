import React, { useState } from 'react'
import InputEmoji from 'react-input-emoji'
// import { Editor } from '@tinymce/tinymce-react';
import './home.scss'

export default function Home () {
  const [message, setMessage] = useState('')

  return (
    <div>
      <div className='chat-content'>{message}</div>
      <InputEmoji
        cleanOnEnter
        onEnter={setMessage}
        placeholder='Type a message'
      />
    </div>
  )
}
