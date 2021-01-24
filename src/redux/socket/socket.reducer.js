import SocketActionTypes from './socket.types'

const INITIAL_STATE = {
  openSocket: {}
}

const socketReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SocketActionTypes.CONNECT_SOCKET:
    return {
      ...state,
      opensocket: action.payload
    }
  case SocketActionTypes.DISCONNECT_SOCKET:
    return {
      ...state,
      openSocket: action.payload
    }
  default:
    return state
  }
}

export default socketReducer
