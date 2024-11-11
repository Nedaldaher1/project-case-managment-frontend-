import { useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie'; // استيراد مكتبة js-cookie
import { loginUser } from '../api/authApi'; // افترض أنك لا تحتاج logoutUser
import { useUser } from '@/context/userContext';
import { toast } from 'react-hot-toast';

const useAuth = () => {
    const queryClient = useQueryClient();
    const userContext = useUser();

    const { login, logout } = userContext;

    const loginMutation = useMutation(({ username, password }: { username: string; password: string }) => loginUser(username, password),
        {
            onSuccess: (data) => {
                if (data) {
                    Cookies.set('token', data.token); // تخزين الرمز المميز في الكوكيز
                    login();
                    toast.success('تم تسجيل الدخول بنجاح');
                    queryClient.invalidateQueries('session');
                } else {
                    toast.error('فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
                }
            },
            onError: (error) => {
                toast.error('حدث خطأ ما');
                console.error('Login error:', error);
            }
        }
    );

    const logoutMutation = () => {
        Cookies.remove('token'); // تأكد من استخدام اسم الكوكي الذي يخزن فيه الرمز المميز
        logout(); // تحديث حالة المستخدم في UserContext
        queryClient.invalidateQueries('session'); // تحديث بيانات الجلسة
    };

    return { loginMutation, logoutMutation };
};

export default useAuth;