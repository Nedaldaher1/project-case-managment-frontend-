import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/context/userContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState({ username: '', password: '' });
    const navigate = useNavigate(); // استخدام useNavigate بدلاً من useHistory
    const { loginMutation } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setFieldError({ username: '', password: '' });

        if (!username) {
            setFieldError(prev => ({ ...prev, username: 'يرجى تعبئة اسم المستخدم' }));
        }
        if (!password) {
            setFieldError(prev => ({ ...prev, password: 'يرجى تعبئة كلمة المرور' }));
        }
        if (!username || !password) {
            return;
        }

        try {
            const data = await loginMutation.mutateAsync({ username, password });
            Cookies.set('username', data.user.username, { expires: 1 });
            Cookies.set('uuid', data.user.id, { expires: 1 });
            Cookies.set('role', data.user.role, { expires: 1 });
            Cookies.set('member_number', data.user.memberNumber, { expires: 1 });
            Cookies.set('isAdmin', (data.user.role === 'admin' || data.user.role === 'onwer').toString(), { expires: 1 });

            // التوجيه إلى الصفحة الرئيسية ثم إعادة تحميل الصفحة
            navigate('/');
            window.location.reload();  // إعادة تحميل الصفحة
        } catch (error) {
            setError('حدث خطأ غير متوقع');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
            if (value) setFieldError(prev => ({ ...prev, username: '' }));
        } else {
            setPassword(value);
            if (value) setFieldError(prev => ({ ...prev, password: '' }));
        }
    };

    return (
        <div className='flex items-center justify-center h-[80vh]'>
            <div className='w-[856px] h-[587px] rounded-2xl flex bg-[#F6F5F7]'>
                <div className='w-[418px] h-[587px] bg-[#45369f] rounded-s-2xl flex items-center justify-center'>
                    <h1 className='text-white text-center font-[Cairo] text-[96px] leading-[150px] font-bold w-[201px]'>
                        مرحباً بك
                    </h1>
                </div>
                <div className='flex flex-col flex-1 relative'>
                    <div className='absolute top-4 right-4'>
                        <img src='/logo.png' alt='logo' width={186} height={77} />
                    </div>
                    <div className='flex flex-col items-center justify-center h-full space-y-4'>
                        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center h-full space-y-4'>
                            <div dir='rtl'>
                                <Input
                                    className='border-[1px] border-black w-[375px]'
                                    type='text'
                                    name='username'
                                    placeholder='اسم المستخدم'
                                    value={username}
                                    onChange={handleChange}
                                    dir='rtl'
                                />
                                {fieldError.username && (
                                    <span className='text-red-500 text-sm'>{fieldError.username}</span>
                                )}
                                {error && (
                                    <span className='text-red-500 text-sm'>{error}</span>
                                )}
                            </div>

                            <div dir='rtl'>
                                <Input
                                    className='border-[1px] border-black w-[375px]'
                                    type='password'
                                    name='password'
                                    placeholder='كلمة المرور'
                                    value={password}
                                    onChange={handleChange}
                                    dir='rtl'
                                />
                                {fieldError.password && (
                                    <span className='text-red-500 text-sm'>{fieldError.password}</span>
                                )}
                                {error && (
                                    <span className='text-red-500 text-sm'>{error}</span>
                                )}
                            </div>

                            <Button
                                type='submit'
                                className='w-[252px] bg-[#45369f] hover:bg-[#5643bd]'
                            >
                                تسجيل الدخول
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
