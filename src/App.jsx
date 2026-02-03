import { Provider } from 'react-redux'
import { store } from './app/store'
import './App.css'
import { useTheme } from './hooks/useTheme'
import Home from './routes/User/Home'
// import ProductDetails from './routes/User/ProductDetails'
// import Cart from './routes/User/Cart'
// import Dashboard from './routes/Admin/Dashboard'

function App() {
  const { theme } = useTheme()
  return null
}

export default App
