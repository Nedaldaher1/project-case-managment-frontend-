import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/context/userContext';
import { verifyToken2FA } from '@/api/authApi';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

interface UserData {
    user: {
        username: string;
        id: string;
        role: string;
        member_id: string;
    };
}

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState({ username: '', password: '' });
    const [is2FA, setIs2FA] = useState(false);
    const navigate = useNavigate(); // استخدام useNavigate بدلاً من useHistory
    const { loginMutation } = useAuth();
    const [data, setData] = useState<UserData | null>(null);
    const { login } = useUser();

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
            setData(data);

            setIs2FA(true)
        } catch (error) {
            setError('حدث خطأ غير متوقع');

        }
    };

    const handleSubmit2FA = async ({ pin }: { pin: string }) => {
        try {
            const res = await verifyToken2FA(pin, data?.user.id || ''); ;
            console.log(res);
            if (res && typeof res === 'object' && 'status' in res && res.status === 200) {
                if (data) { 
                    Cookies.set('username', data.user.username, { expires: 1 });
                    Cookies.set('uuid', data.user.id, { expires: 1 });
                    Cookies.set('role', data.user.role, { expires: 1 });
                    Cookies.set('member_number', data.user.member_id, { expires: 1 });
                    Cookies.set('isAdmin', (data.user.role === 'admin' || data.user.role === 'owner').toString(), { expires: 1 });
                }
                navigate('/');
                window.location.reload();
                setIs2FA(false);
            }
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
    const form = useForm<{ pin: string }>({
        resolver: zodResolver(FormSchema),
    });
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
                        {
                            !is2FA ? (
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
                            ) : (


                                <Form  {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit2FA)} className="w-2/3 flex flex-col justify-center items-center space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="pin"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col items-center gap-5'>
                                                    <FormLabel> 2FA التحقق الثنائي</FormLabel>
                                                    <FormControl>
                                                        <InputOTP maxLength={6} {...field}>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                            </InputOTPGroup>
                                                            <InputOTPSeparator />
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                            </InputOTPGroup>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>

                                                    </FormControl>
                                                    <FormDescription dir='rtl'>
                                                        اذهب الى تطبيق Google Authenticator وادخل الرقم الموجود في التطبيق أو أتصل بالمطور
                                                    </FormDescription>
                                                    <FormMessage>
                                                        {form.formState.errors.pin?.type === "required" && (
                                                            <span className="text-red-500">
                                                                هذا الحقل مطلوب.
                                                            </span>
                                                        )}
                                                        {form.formState.errors.pin?.type === "minLength" && (
                                                            <span className="text-red-500">
                                                                يجب أن يتكون رمز التحقق من 6 أحرف.
                                                            </span>
                                                        )}
                                                    </FormMessage>                                          </FormItem>
                                            )}
                                        />

                                        <Button type="submit">ارسال</Button>
                                    </form>
                                </Form>
                            )

                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
