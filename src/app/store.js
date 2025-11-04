import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'
import productReducer from '../features/product/productSlice'
import cartReducer from '../features/cart/cartSlice'
import categoryReducer from '../features/categories/categorySlice'
import orderReducer from '../features/orders/orderSlice'

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'] // Only persist the token
}

// Persist config for theme
const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['mode'] // Only persist theme mode
}

// Persist config for cart
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'] // Persist cart items
}

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    theme: persistReducer(themePersistConfig, themeReducer),
    cart: persistReducer(cartPersistConfig, cartReducer),
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)