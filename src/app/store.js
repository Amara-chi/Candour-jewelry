import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'  
import cartReducer from '../features/cart/cartSlice'
import categoryReducer from '../features/categories/categorySlice'
import orderReducer from '../features/orders/orderSlice'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    orders: orderReducer,
    auth: authReducer,
    theme: themeReducer,
  },
})
