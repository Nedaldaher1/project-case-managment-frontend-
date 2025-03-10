// صفحاتة حماية الروابط
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/userContext';
import { ReactNode, useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchVerifyToken } from '@/api/authApi';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { 
    isLoggedIn, 
    setStatusLoggedIn, 
    is2FARequired,
    tempUserData,
    logout
  } = useAuth();
  const navigate = useNavigate();

  // 1. التحقق من وجود بيانات مؤقتة


  // 2. التحقق من صحة التوكن
  const { isLoading, isError } = useQuery(
    'session',
    fetchVerifyToken,
    {
      onSuccess: () => {
        if (!is2FARequired) {
          setStatusLoggedIn();
        }
      },
      onError: () => navigate('/login'),
      retry: false,
      enabled: !is2FARequired
    }
  );

  // 3. التحقق النهائي من حالة المستخدم
  if (isLoading) return <div>Loading...</div>;
  
  if (isLoggedIn) return <Outlet />;
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;