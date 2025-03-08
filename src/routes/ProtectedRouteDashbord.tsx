import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/userContext';
import { ReactNode, useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useQuery } from 'react-query';
import { fetchVerifyToken } from '@/api/authApi';

const ProtectedRouteDashboard = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn ,userData } = useAuth();
    const isAdmin = userData?.role === 'admin';
    const token = Cookie.get('token');

    // التحقق من صحة التوكن باستخدام react-query وإعداد حالة admin حسب الدور
    const { data, error, isLoading } = useQuery(
        'session',
        () => fetchVerifyToken(),
        {
            onSuccess: () => {
            },
            enabled: !!token, // يُفعَّل الاستعلام فقط إذا كان هناك توكن
            refetchOnWindowFocus: false, // إلغاء التحديث عند تركيز النافذة لزيادة الأداء
            onError: (error: Error) => {
                console.error('فشل التحقق من الجلسة:', error.message);
            }
        }
    );

    // معالجة تحميل مخصصة
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>حدث خطأ أثناء التحقق من الجلسة.</div>;

    return isLoggedIn && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRouteDashboard;
