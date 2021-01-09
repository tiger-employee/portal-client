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
  const [messageArray, setMessageArray] = useState([])

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
        const responseData = { ...response.data.message, name: props.user.email }
        console.log(responseData)
        openSocket.emit('sendMessage', responseData)
        return responseData
      })
      .then(data => {
        console.log(data)
        setMessageArray([
          ...messageArray,
          data])
      })
    //   .then(setMessage({}))
  }

  // this is sending new user information every time something is sent, but is working for the initial log in.
  useEffect(() => {
    console.log('I am in here')
    const socket = io('http://localhost:4741')
    setOpenSocket(socket)
    socket.on('hello', (message) => { console.log(message) })
    socket.on('message', (msg) => {
      setMessageArray(msg)
    })
  }, [])

  console.log(messageArray)
  return (
    <div>
      <div className='chat-content'>{messageArray.map(item => (
        <p key={item._id}>{item.name}:{item.text}</p>
      ))}
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
