import React from 'react'
import Home from '../Home/Home'

const ChatHome = ({ user }) => {
  return (
    <button onClick={ () => <Home user={user} /> }>Click to chat</button>
  )
}

export default ChatHome
