import { createSlice } from '@reduxjs/toolkit'

const categorySlice = createSlice({
  name: 'categorys',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    // Add reducers later during Week 2
  }
})

export default categorySlice.reducer