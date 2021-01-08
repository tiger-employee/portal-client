import React, { useState } from 'react'
import InputEmoji from 'react-input-emoji'
// import { Editor } from '@tinymce/tinymce-react';
import io from 'socket.io-client'
import './home.scss'
const socket = io('http://localhost:4741')

export default function Home () {
  const [message, setMessage] = useState('')
  const [messageArray, setMessageArray] = useState([])

  const sendMessage = (message) => {
    setMessage(message)
    socket.emit('message', message)
  }

  socket.on('hello', (message) => console.log(message))
  socket.on('message', (msg) => (
    setMessageArray([
      ...messageArray,
      msg
    ])
  )
  )
  console.log(messageArray)
  console.log(message)
  return (
    <div>
      <div className='chat-content'>{messageArray.map(item => (
        <p key={item}>{item}</p>
      ))}
      </div>
      <InputEmoji
        cleanOnEnter
        onEnter={sendMessage}
        placeholder='Type a message'
      />
    </div>
  )
}
