// src/context/userContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { verifyToken2FA, loginUser } from '@/api/authApi';
import { useMutation } from 'react-query';
import { encryptData, decryptData } from '@/utils/encryptData';
import {deleteAllCookies} from '@/utils/cookiesData'

interface UserData {
  id: string;
  username: string;
  role: string;
  member_id: string;
  officesAvailable: Array<JSON>;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  userData: UserData | null;
  tempUserData: UserData | null;
  is2FARequired: boolean;
  verify2FA: (token: string) => Promise<void>;
  error: string;
  fieldErrors: { username: string; password: string };
  isUnauthorized: boolean;
  setStatusLoggedIn: () => void;
  token: string;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  userData: null,
  tempUserData: null,
  is2FARequired: false,
  verify2FA: async () => {},
  error: '',
  fieldErrors: { username: '', password: '' },
  isUnauthorized: false,
  setStatusLoggedIn: () => {},
  token: '', 
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn ? decryptData(storedIsLoggedIn) : false;
  });
  const [userData, setUserData] = useState<UserData | null>(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? decryptData(storedUserData) : null;
  });
  const [tempUserData, setTempUserData] = useState<UserData | null>(() => {
    const storedTempUserData = localStorage.getItem('tempUserData');
    return storedTempUserData ? decryptData(storedTempUserData) : null;
  });
  const [is2FARequired, setIs2FARequired] = useState(!!tempUserData);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [token, setJwt] = useState(Cookies.get('token') || '');

  // حفظ tempUserData في localStorage عند تغييرها
  useEffect(() => {
  
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', encryptData(isLoggedIn));
    }
    if(userData){
      localStorage.setItem('userData', encryptData(userData));
    }
  }, [tempUserData,isLoggedIn,userData]);

  useEffect(() => {

    if (tempUserData) {
      localStorage.setItem('tempUserData', encryptData(tempUserData
      ));
    }else{
      localStorage.removeItem('tempUserData');
    }
  }, [tempUserData]);

  // طلب تسجيل الدخول الأساسي
  const loginMutation = useMutation(
    ({ username, password }: { username: string; password: string }) => loginUser(username, password),
    {
      onSuccess: (data) => {
        const user = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          member_id: data.user.member_id,
          officesAvailable: data.user.officesAvailable,
        };
        console.log(data)
        setTempUserData(user);
        setIs2FARequired(true);
        setError('');
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'فشل تسجيل الدخول');
      },
    }
  );

  // طلب التحقق من 2FA
  const verify2FAMutation = useMutation(
    (token: string) => verifyToken2FA(token, tempUserData?.id || ''),
    {
      onSuccess: (data) => {
        if ((data as { status: number }).status === 200) {
          Cookies.set('uuid', tempUserData?.id || '');
          Cookies.set('token', (data as { data: { token: string } }).data.token);
          setUserData(tempUserData);
          setIsLoggedIn(true);
          setIs2FARequired(false);
          setTempUserData(null); // هنا يتم تحديث الحالة لإزالة البيانات من localStorage
          navigate('/');
          window.location.reload();
          console.log(data)
          // window.location.reload();
        }
      },
      onError: (error: any) => {
        setIsUnauthorized(true);
        setError(error.response?.data?.message || 'الرمز غير صحيح');
      },
    }
  );

  const login = async (username: string, password: string) => {
    setError('');
    setFieldErrors({ username: '', password: '' });

    if (!username || !password) {
      setFieldErrors({
        username: !username ? 'يرجى تعبئة اسم المستخدم' : '',
        password: !password ? 'يرجى تعبئة كلمة المرور' : '',
      });
      return;
    }

    try {
      await loginMutation.mutateAsync({ username, password });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const verify2FA = async (token: string) => {
    try {
      await verify2FAMutation.mutateAsync(token);
    } catch (error) {
      console.error('2FA error:', error);
    }
  };

  const logout = () => {
    // delete all cookies
    setIsLoggedIn(false);
    setUserData(null);
    setTempUserData(null); // هنا يتم تحديث الحالة لإزالة البيانات من localStorage
    localStorage.removeItem('tempUserData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    deleteAllCookies();
    navigate('/');
    window.location.reload();
  };

  const setStatusLoggedIn = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userData,
        tempUserData,
        is2FARequired,
        verify2FA,
        error,
        fieldErrors,
        isUnauthorized,
        setStatusLoggedIn,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);