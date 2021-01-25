import React, { useEffect, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { useImmer } from 'use-immer'

import io from 'socket.io-client'
import './home.scss'

const Home = (props) => {
  const [openSocket, setOpenSocket] = useState({ name: props.user.email })
  const [messageArray, setMessageArray] = useImmer([])
  const [userArray, setUserArray] = useImmer([])

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
        setMessageArray(draft => {
          draft.push(response.data.message)
        })
        return response.data.message
      })
  }

  useEffect(() => {
    const socket = io('http://localhost:3000')
    setOpenSocket(socket)
    socket.emit('username', props.user.email)

    socket.on('email', userArr => setUserArray(draft => {
      draft.push(...userArr)
    }))

    socket.on('addUserToChat', email => {
      setUserArray(draft => {
        draft.push(email)
      })
    })

    socket.on('message', (msg) => {
      setMessageArray(draft => {
        draft.push(msg)
      })
    })
    
    socket.on('disconnected', (email) => {
      const index = userArray.findIndex(element => element === email)
      setUserArray(draft => {
        draft.splice(index, 1)
      }
      )
    })
    return () => socket.disconnect()
  }, [])

  const messages = messageArray.map((messageObj) => {
    return (
      <div key={messageObj._id}>{messageObj.name}:  {messageObj.text}<br/></div>
    )
  })

  const users = userArray.map((user) => {
    return (
      <div key={user}>{user}<br/></div>
    )
  })
  return (
    <div>
      <div className='chat-container'>
        <div className='chat-content'>
          {messages}
        </div>
        <div className='chat-users'>
          {users}
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
