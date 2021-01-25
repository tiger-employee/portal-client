import React, { useEffect, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import axios from 'axios'
import apiUrl from '../../apiConfig'

import io from 'socket.io-client'
import './home.scss'

const Home = (props) => {
  const [openSocket, setOpenSocket] = useState({ name: props.user.email })
  console.log(props)

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
    console.log('i am being used')
    const socket = io('http://localhost:3000')
    setOpenSocket(socket)
    socket.emit('username', props.user.email)

    socket.on('newConnection', (message) => {
      console.log(message)
    })

    socket.on('email', userArr => {
      const chatUsers = document.querySelector('.chat-users')
      userArr.forEach((user) => {
        const chatUserNode = document.createElement('p')
        chatUserNode.setAttribute('id', `${user}`)
        const chatUserText = document.createTextNode(`${user}`)
        chatUserNode.appendChild(chatUserText)
        chatUsers.append(chatUserNode)
      })
    })

    socket.on('addUserToChat', email => {
      const chatUsers = document.querySelector('.chat-users')
      const chatUserNode = document.createElement('p')
      chatUserNode.setAttribute('id', `${email}`)
      const chatUserText = document.createTextNode(`${email}`)
      chatUserNode.appendChild(chatUserText)
      chatUsers.append(chatUserNode)
    })

    socket.on('message', (msg) => {
      const chatContent = document.querySelector('.chat-content')
      chatContent.append(`${msg.name}:  ${msg.text}`)
      chatContent.appendChild(document.createElement('br'))
    })
    socket.on('disconnected', (email) => {
      const userToRemove = document.getElementById(`${email}`)
      userToRemove.remove()
    })
    return () => socket.disconnect()
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
    </div>
  )
}

export default Home
