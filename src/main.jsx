import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <App />
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
    </Provider>
  </StrictMode>,
)
