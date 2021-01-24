import { combineReducers } from 'redux'
// import userReducer from './user/user.reducer'
import socketReducer from './socket/socket.reducer'

const rootReducer = combineReducers({
  // user: userReducer,
  socket: socketReducer
})

export default rootReducer