import { createSlice } from '@reduxjs/toolkit'

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    // Add reducers later during Week 2
  }
})

export default orderSlice.reducer