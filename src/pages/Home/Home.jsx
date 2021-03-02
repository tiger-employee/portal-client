import React, { useEffect, useState, useRef } from 'react'
import InputEmoji from 'react-input-emoji'
import { BiImageAdd, BiVideoPlus } from 'react-icons/bi'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { useImmer } from 'use-immer'
import S3FileUpload from 'react-s3'
import Webcam from 'react-webcam'
import Modal from 'react-bootstrap/Modal'
import io from 'socket.io-client'
import ScrollToBottom from 'react-scroll-to-bottom'
import './home.scss'

const Home = (props) => {
  const [openSocket, setOpenSocket] = useState({ name: props.user.email })
  const [messageArray, setMessageArray] = useImmer([])
  const [userArray, setUserArray] = useImmer([])
  const [getImage, setGetImage] = useState()
  const [showModal, setShowModal] = useState(false)
  const webcamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const [capturing, setCapturing] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])

  const hiddenFileInput = React.useRef(null)
  const handleVideoOpen = () => setShowModal(true)
  const handleClose = () => setShowModal(false)
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
    } else if (event.target.files[0].type === 'video/mp4') {
      S3FileUpload.uploadFile(event.target.files[0], config)
        .then((data) => {
          const updatedMessage = { name: props.user.email, text: data.location, owner: props.user.id, isVideo: true }
          setGetImage(data.location)
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
      alert('Please choose an appropriate file')
    }
  }

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true)
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm'
    })
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    )
    mediaRecorderRef.current.start()
  }, [webcamRef, setCapturing, mediaRecorderRef])

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data))
      }
    },
    [setRecordedChunks]
  )

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop()
    setCapturing(false)
  }, [mediaRecorderRef, webcamRef, setCapturing])

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/mp4'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'
      a.href = url
      a.download = `${props.user.email}-webcam-stream-capture.webm`
      a.click()
      console.log(a)
      window.URL.revokeObjectURL(url)
      setRecordedChunks([])
      console.log(recordedChunks)
      S3FileUpload.uploadFile(a.download, config)
        .then((data) => {
          const updatedMessage = { name: props.user.email, text: data.location, owner: props.user.id, isVideo: true }
          setGetImage(data.location)
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
    }
  }, [recordedChunks])

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
        props.user.email.includes(messageObj.name) ? <div key={messageObj._id} className='message-container-self'><span className='chat-user-self'>{messageObj.name}:</span>  <img className='image-chat' src={messageObj.text} alt='image'/><br/></div>
          : <div key={messageObj._id} className='message-container-other'><span className='chat-user-other'>{messageObj.name}:</span>   <img className='image-chat' src={messageObj.text} alt='image'/><br/></div>
      )
    } else if (messageObj.isVideo) {
      return (
        props.user.email.includes(messageObj.name) ? <div key={messageObj._id} className='message-container-self'><span className='chat-user-self'>{messageObj.name}:</span>  <video type='video/mp4' controls className='video-chat' src={messageObj.text} alt='image'/><br/></div>
          : <div key={messageObj._id} className='message-container-other'><span className='chat-user-other'>{messageObj.name}:</span>   <video type='video/mp4' className='video-chat' src={messageObj.text} alt='image'/><br/></div>
      )
    } else {
      return (
        props.user.email.includes(messageObj.name) ? <div key={messageObj._id} className='message-container-self'><span className='chat-user-self'>{messageObj.name}:</span>  {messageObj.text}<br/></div>
          : <div key={messageObj._id} className='message-container-other'><span className='chat-user-other'>{messageObj.name}:</span>  {messageObj.text}<br/></div>
      )
    }
  })

  const users = userArray.map((chatUser) => {
    return (
      props.user.email.includes(chatUser) ? <div key={chatUser} className='chat-user-self'>{chatUser}<br/></div> : <div key={chatUser} className='chat-user-other'>{chatUser}<br/></div>
    )
  })
  console.log(users)
  return (
    <div>
      <div className='chat-container'>
        <ScrollToBottom className='chat-content'>{messages}</ScrollToBottom>
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
        <div className='image-input' onClick={onFileUploadClick}><BiVideoPlus/></div>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        <button onClick={handleVideoOpen}>WebCam Record</button>
        <Modal
          show={showModal}
          onHide={handleClose}
          data-backdrop="true"
          keyboard={false}
        >
          <Modal.Body className='webcam-container'>
            <Webcam audio={true} ref={webcamRef} width={'350px'}/>
            <div>
              {capturing ? (
                <button onClick={handleStopCaptureClick}>Stop Capture</button>
              ) : (
                <button onClick={handleStartCaptureClick}>Start Capture</button>
              )}
              {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>Download</button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default Home
