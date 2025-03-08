import { useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie'; // استيراد مكتبة js-cookie
import { loginUser } from '../api/authApi'; // افترض أنك لا تحتاج logoutUser
import { useAuth as useUserContext } from '@/context/userContext';
import { toast } from 'react-hot-toast';

const useAuth = () => {
    const queryClient = useQueryClient();
    const userContext = useUserContext();

    const { logout } = userContext;

    const loginMutation = useMutation(({ username, password }: { username: string; password: string }) => loginUser(username, password),
        {
            onSuccess: (data) => {
                if (data) {
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
        logout(); // تحديث حالة المستخدم في UserContext
        queryClient.invalidateQueries('session'); // تحديث بيانات الجلسة
    };

    return { loginMutation, logoutMutation };
};

export default useAuth;