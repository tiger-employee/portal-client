import React, { useEffect, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import axios from 'axios'
import apiUrl from '../../apiConfig'

import io from 'socket.io-client'
import './home.scss'

export default function Home (props) {
  const [openSocket, setOpenSocket] = useState({ name: props.user.email })

  const sendMessage = (messageContent) => {
    const updatedMessage = { name: props.user.email, text: messageContent, owner: props.user.id }
    axios({
      url: `${apiUrl}/messages/`,
      method: 'POST',
      headers: {
        Authorization: `Token token=${props.user.token}`
      },
      data: { message: updatedMessage }
    })
      .then(response => {
        openSocket.emit('sendMessage', response.data.message)
        const chatContent = document.querySelector('.chat-content')
        chatContent.append(`${response.data.message.name}:  ${response.data.message.text}`)
        chatContent.appendChild(document.createElement('br'))
        return response.data.message
      })
  }

  // this is sending new user information every time something is sent, but is working for the initial log in.
  // add sending user information to server to pass it to all users that the person entered
  useEffect(() => {
    const socket = io('http://localhost:3000')
    setOpenSocket(socket)

    socket.on('newConnection', (message) => {
      console.log(message)
      socket.emit('username', props.user.email)
    })

    socket.on('email', userInfo => {
      const chatUsers = document.querySelector('.chat-users')
      chatUsers.append(`${userInfo}`)
      chatUsers.appendChild(document.createElement('br'))
    })

    socket.on('message', (msg) => {
      const chatContent = document.querySelector('.chat-content')
      chatContent.append(`${msg.name}:  ${msg.text}`)
      chatContent.appendChild(document.createElement('br'))
    })
  }, [])

  return (
    <div>
      <div className='chat-container'>
        <div className='chat-content'>
        </div>
        <div className='chat-users'>
        </div>
      </div>
      <InputEmoji
        cleanOnEnter
        onEnter={sendMessage}
        placeholder='Type a message'
      />
      <button onClick={() => openSocket.close()}></button>
    </div>
  )
}
