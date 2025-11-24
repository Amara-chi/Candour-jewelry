import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme, setTheme } from '../features/theme'

export const useTheme = () => {
  const theme = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  const toggle = () => dispatch(toggleTheme())
  const set = (mode) => dispatch(setTheme(mode))

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme: toggle,
    setTheme: set,
  }
}
