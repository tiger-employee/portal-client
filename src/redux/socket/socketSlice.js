import { createSlice } from '@reduxjs/toolkit'

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    openSocket: {}
  },
  reducers: {
    connectSocket: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.openSocket = action.payload
    }
  }
})

export const { connectSocket } = socketSlice.actions

export const selectSocket = state => state.socket.openSocket

export default socketSlice.reducer
