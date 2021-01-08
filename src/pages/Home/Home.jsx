import React, { useState } from 'react'
import InputEmoji from 'react-input-emoji'
// import { Editor } from '@tinymce/tinymce-react';
// import useSocket from 'use-socket.io-client'
import io from 'socket.io-client'
import './home.scss'

const socket = io('http://localhost:4741')

export default function Home () {
  const [message, setMessage] = useState('')

  const sendMessage = (message) => {
    setMessage(message)
    return socket.emit('message', message)
  }
  //   const [socket] = useSocket('http://localhost:4741')

  socket.on('hello', (message) => console.log(message))
  socket.on('message', (message) => setMessage(message))
  return (
    <div>
      {console.log(socket)}
      <div className='chat-content'>{message}</div>
      <InputEmoji
        cleanOnEnter
        onEnter={sendMessage}
        placeholder='Type a message'
      />
    </div>
  )
}
