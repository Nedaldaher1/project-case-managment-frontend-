import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookie from 'js-cookie';

const UserContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    member_number: 0 as number,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        // جلب الحالة من ملفات تعريف الارتباط عند تحميل المكون
        return Cookie.get('isLoggedIn') === 'true';
    });

    // تحديث ملفات تعريف الارتباط عند تغيير قيمة `isLoggedIn`
    useEffect(() => {
        if (isLoggedIn) {
            Cookie.set('isLoggedIn', 'true', { secure: true, sameSite: 'Strict' });
        } else {
            Cookie.remove('isLoggedIn');
        }
    }, [isLoggedIn]);

    const login = () => {
        setIsLoggedIn(true);
        Cookie.set('isLoggedIn', 'true', { secure: true, sameSite: 'Strict' });
    };

    const logout = () => {
        setIsLoggedIn(false);
        Cookie.remove('token');
        Cookie.remove('isLoggedIn');
        Cookie.remove('username');
        Cookie.remove('uuid');
        Cookie.remove('role');
        Cookie.remove('member_number');

    };
    const member_number = parseInt(Cookie.get('member_number') || '0');

    return (
        <UserContext.Provider value={{ isLoggedIn, login, logout,member_number }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
