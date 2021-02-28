import React, { useEffect, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import { BiImageAdd } from 'react-icons/bi'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { useImmer } from 'use-immer'
import S3FileUpload from 'react-s3'

import io from 'socket.io-client'
import './home.scss'

const Home = (props) => {
  const [openSocket, setOpenSocket] = useState({ name: props.user.email })
  const [messageArray, setMessageArray] = useImmer([])
  const [userArray, setUserArray] = useImmer([])
  const [getImage, setGetImage] = useState()
  const hiddenFileInput = React.useRef(null)

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

  const secret = process.env.REACT_APP_SECRET_KEY
  const access = process.env.REACT_APP_ACCESS_KEY

  const config = {
    bucketName: 'employee-portal-profile-image',
    region: 'us-east-2',
    secretAccessKey: secret,
    accessKeyId: access
  }

  const onFileUploadClick = event => {
    hiddenFileInput.current.click()
  }

  const onFileChange = event => {
    if (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/gif' || event.target.files[0].type === 'image/png') {
      S3FileUpload.uploadFile(event.target.files[0], config)
        .then((data) => {
          const updatedMessage = { name: props.user.email, text: data.location, owner: props.user.id, isImage: true }
          setGetImage(data.location)
          console.log(data.location)
          return axios({
            url: `${apiUrl}/messages/`,
            method: 'POST',
            headers: {
              'Authorization': `Token token=${props.user.token}`
            },
            data: {
              message: updatedMessage
            }
          })
        })
        .then(response => {
          openSocket.emit('sendMessage', response.data.message)
          console.log(response.data.message)
          setMessageArray(draft => {
            draft.push(response.data.message)
          })
          return response.data.message
        })
        .then(console.log(getImage, ' loaded successfully'))
        .catch((err) => {
          alert(err)
        })
    } else {
      alert('Please choose an image file')
    }
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
      console.log(msg)
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
    if (messageObj.isImage) {
      return (
        props.user.email.includes(messageObj.name) ? <div key={messageObj._id}><span className='chat-user-self'>{messageObj.name}:</span>  <img src={messageObj.text} alt='image'/><br/></div>
          : <div key={messageObj._id}><span className='chat-user-other'>{messageObj.name}:</span>   <img src={messageObj.text} alt='image'/><br/></div>
      )
    } else {
      return (
        props.user.email.includes(messageObj.name) ? <div key={messageObj._id}><span className='chat-user-self'>{messageObj.name}:</span>  {messageObj.text}<br/></div>
          : <div key={messageObj._id}><span className='chat-user-other'>{messageObj.name}:</span>  {messageObj.text}<br/></div>
      )
    }
  })

  const users = userArray.map((chatUser) => {
    return (
      props.user.email.includes(chatUser) ? <div key={chatUser} className='chat-user-self'>{chatUser}<br/></div> : <div key={chatUser} className='chat-user-other'>{chatUser}<br/></div>
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
      <div className='emoji-input'>
        <InputEmoji
          cleanOnEnter
          onEnter={sendMessage}
          placeholder='Type a message'
        />
        <div className='image-input' onClick={onFileUploadClick}><BiImageAdd/></div>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default Home
