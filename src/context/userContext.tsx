import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookie from 'js-cookie';

const UserContext = createContext({
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
    member_number: 0 as number,
    isAdmin: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        // جلب الحالة من ملفات تعريف الارتباط عند تحميل المكون
        return Cookie.get('isLoggedIn') === 'true';
    });

    const [isAdmin, setIsAdmin] = useState<boolean>(Cookie.get('isAdmin') === 'true' || false);
    useEffect(() => {
        if (isLoggedIn) {
            Cookie.set('isLoggedIn', 'true', { secure: true, sameSite: 'Strict' });
        } else {
            Cookie.remove('isLoggedIn');
        }
    }, [isLoggedIn]);

    const login = () => {
        setIsLoggedIn(true);
        return true;
    };

    const logout = async () => {
        try {
            setIsLoggedIn(false);
            Cookie.remove('isLoggedIn');
            Cookie.remove('username');
            Cookie.remove('uuid');
            Cookie.remove('role');
            Cookie.remove('member_number');
            Cookie.remove('isAdmin');
            Cookie.remove('sidebar:state')
            window.location.reload();

        } catch (error) {
            console.error('Error logging out:', error);

        }

    };
    const member_number = parseInt(Cookie.get('member_number') || '0');
    return (
        <UserContext.Provider value={{ isLoggedIn, login, logout, member_number, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
