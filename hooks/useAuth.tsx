// useAuth.tsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }

  const { userToken, login, logout, isLoading } = context;

  return { userToken, login, logout, isLoading };
};

export default useAuth;