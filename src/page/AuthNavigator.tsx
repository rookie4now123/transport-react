import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../helpers/authStore';

export function AuthNavigator() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);
    return null;
  }