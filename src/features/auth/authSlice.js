import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auths',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    // Add reducers later during Week 2
  }
})

export default authSlice.reducer