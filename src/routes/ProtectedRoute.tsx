import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/userContext';
import { ReactNode , useEffect } from 'react';
import Cookie from 'js-cookie';
import { useQuery } from 'react-query';
import { fetchVerifyToken } from '@/api/authApi';


const ProtectedRoute = ({ children }:{children:ReactNode}) => {
  const { isLoggedIn,login,logout } = useUser();
  const token = Cookie.get('token');


  useEffect(() => {
      if (!token) {
        logout();
      }
  }, [token]);


  useQuery('session', () => fetchVerifyToken(token as string), {
    onSuccess: () => {
        login();
    },
    onError: (error: any) => {
        logout();
        console.log('Token verification failed:', error.message);
    },
    enabled: !!token,
});

  return (
    isLoggedIn ? children : <Navigate to="/login" replace />
  )
};

export default ProtectedRoute;
