import { Socket } from 'socket.io-client'
import SocketActionTypes from './socket.types'

export const disconnectSocket = () => ({
  type: SocketActionTypes.DISCONNECT_SOCKET,
  payload: connectedSocket
})

export const connectSocket = () => ({
  type: SocketActionTypes.CONNECT_SOCKET,
  payload: connectedSocket
})
