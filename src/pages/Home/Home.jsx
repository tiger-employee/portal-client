import React, { useEffect, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import axios from 'axios'
import apiUrl from '../../apiConfig'

import io from 'socket.io-client'
import Feed from '../../components/Feed/Feed'
import './home.scss'

export default function Home (props) {
  const [openSocket, setOpenSocket] = useState({ name: props.user.email })
  //   const [message, setMessage] = useState({ name: props.user.email })
  //   const [messageArray, setMessageArray] = useState([])

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
    //   .then(setMessage({}))
  }

  // this is sending new user information every time something is sent, but is working for the initial log in.
  useEffect(() => {
    const socket = io('http://localhost:4741')
    setOpenSocket(socket)
    socket.on('newConnection', (message) => { console.log(message) })
    socket.on('message', (msg) => {
      console.log(msg)
      const chatContent = document.querySelector('.chat-content')
      chatContent.append(`${msg.name}:  ${msg.text}`)
      chatContent.appendChild(document.createElement('br'))
    })
  }, [])

  return (
    <div>
      <div className='chat-content'>
      </div>
      <InputEmoji
        cleanOnEnter
        onEnter={sendMessage}
        placeholder='Type a message'
      />
      <Feed user={props.user}/>
    </div>
  )
}
