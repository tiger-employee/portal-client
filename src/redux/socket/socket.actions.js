import SocketActionTypes from './socket.types'

export const disconnectSocket = (disconnectedSocket) => ({
  type: SocketActionTypes.DISCONNECT_SOCKET,
  payload: disconnectedSocket
})

export const connectSocket = (connectedSocket) => ({
  type: SocketActionTypes.CONNECT_SOCKET,
  payload: connectedSocket
})
