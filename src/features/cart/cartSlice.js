import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'carts',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    // Add reducers later during Week 2
  }
})

export default cartSlice.reducer