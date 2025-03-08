import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/userContext';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { fetchVerifyToken } from '@/api/authApi';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, setStatusLoggedIn } = useAuth();

  // التحقق من صحة التوكن فقط إذا كان موجودًا
  const { isLoading, isError } = useQuery(
    'session',
    fetchVerifyToken,
    {
      onSuccess: () => {
        setStatusLoggedIn();
      },
      onError: () => {
        console.error('Token verification failed');
      },
      retry: false, // تعطيل المحاولات التلقائية لتقليل عدد الطلبات
    }
  );

  if (isLoading) {
    return <div>Loading...</div>; // يمكنك استبدال هذا بكومبوننت تحميل مخصص
  }

  if (isError || !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
