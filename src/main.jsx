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

// Add this to your main.jsx temporarily to test
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.MODE);

// Test the health endpoint
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('Health check:', data))
  .catch(err => console.error('Health check failed:', err));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalProvider>
          <AuthInitializer>
            <App />
            <RouterProvider router={router} />
          </AuthInitializer>
          <script>
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker
                  .register('/service-worker.js')
                  .then(reg => console.log('Service worker registered:', reg))
                  .catch(err => console.log('Service worker registration failed:', err));
              })
            }
          </script>
        </ModalProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)