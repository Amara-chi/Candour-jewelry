import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  logout, 
  clearError 
} from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const register = useCallback((userData) => {
    return dispatch(registerUser(userData));
  }, [dispatch]);

  const login = useCallback((credentials) => {
    return dispatch(loginUser(credentials));
  }, [dispatch]);

  const fetchUser = useCallback(() => {
    return dispatch(getMe());
  }, [dispatch]);

  const userLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...auth,
    register,
    login,
    fetchUser,
    logout: userLogout,
    clearError: clearAuthError,
  };
};