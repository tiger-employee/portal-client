import { configureStore } from '@reduxjs/toolkit'
import socketReducer from './socket/socketSlice'

export default configureStore({
  reducer: {
    socket: socketReducer
  }
})
