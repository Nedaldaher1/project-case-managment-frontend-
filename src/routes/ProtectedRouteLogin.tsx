import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/userContext';
import { ReactNode  } from 'react';



const ProtectedRoute = ({ children }:{children:ReactNode}) => {
  const { isLoggedIn } = useUser();




  return (
    isLoggedIn ?  <Navigate to="/" replace />  : children
  )
};

export default ProtectedRoute;
