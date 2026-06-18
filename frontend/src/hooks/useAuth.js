import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// If you want, you can export context from AuthContext file, or adjust import path.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};