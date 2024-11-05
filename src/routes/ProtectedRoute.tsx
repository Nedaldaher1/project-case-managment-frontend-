import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/context/userContext';
import { ReactNode } from 'react';
import Cookie from 'js-cookie';
import { useQuery } from 'react-query';
import { fetchVerifyToken } from '@/api/authApi';


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, login, logout } = useUser();
  const token = Cookie.get('token');

  // التحقق من صحة التوكن فقط إذا كان موجودًا
  const { data, error, isLoading } = useQuery(
    'session',
    () => fetchVerifyToken(token as string),
    {
      onSuccess: () => {
        login();
      },
      onError: (error: Error) => {
        logout();
        console.error('Token verification failed:', error.message);
      },
      enabled: !!token, // التحقق فقط إذا كان التوكن موجودًا
    }
  );

  if (isLoading) {
    return <div>Loading...</div>; // يمكنك استبدال هذا بكومبوننت تحميل مخصص
  }

  if (error || !token) {
    return <Navigate to="/login" replace />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
