import React, { useState } from 'react'
import InputEmoji from 'react-input-emoji'
import './home.scss'

export default function Home () {
  const [text, setText] = useState('')
  const [message, setMessage] = useState([])

  function handleOnEnter (text) {
    setText(text)
    setMessage(text)
  }

  return (
    <div>
      <div className='chat-content'>{message}</div>
      <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder='Type a message'
      />
    </div>
  )
}
