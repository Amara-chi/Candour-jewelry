import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router.jsx'
import { store, persistor } from './app/store.js'
import './index.css'
import App from './App.jsx'
import { ModalProvider } from './components/Modal.jsx'
import { useAuth } from './hooks/useAuth.js'

// Component to initialize auth
const AuthInitializer = ({ children }) => {
  const { fetchUser, token } = useAuth()
  
  React.useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token, fetchUser])

  return children
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalProvider>
          <AuthInitializer>
            <App />
            <RouterProvider router={router} />
          </AuthInitializer>
        </ModalProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)