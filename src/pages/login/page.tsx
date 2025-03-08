import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/userContext'; // تأكد من أن المسار صحيح
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// تعريف مخطط التحقق من صحة رمز 2FA باستخدام Zod
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "يجب أن يتكون الرمز من 6 أرقام",
  }),
});

const Login = () => {
  const { login, verify2FA, is2FARequired, error, fieldErrors, isUnauthorized } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // تهيئة useForm للتحقق من صحة رمز 2FA
  const form = useForm<{ pin: string }>({
    resolver: zodResolver(FormSchema),
  });

  // معالجة تسجيل الدخول
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  // معالجة التحقق من رمز 2FA
  const handle2FASubmit = form.handleSubmit(({ pin }) => {
    verify2FA(pin);
  });

  return (
    <div className='flex items-center justify-center h-[80vh]'>
      <div className='w-[856px] h-[587px] rounded-2xl flex bg-[#F6F5F7]'>
        {/* الجانب الأيسر (الثابت) */}
        <div className='w-[418px] h-[587px] bg-[#45369f] rounded-s-2xl flex items-center justify-center'>
          <h1 className='text-white text-center font-[Cairo] text-[96px] leading-[150px] font-bold w-[201px]'>
            مرحباً بك
          </h1>
        </div>

        {/* الجانب الأيمن (النموذج) */}
        <div className='flex flex-col flex-1 relative'>
          {/* الشعار */}
          <div className='absolute top-4 right-4'>
            <img src='/logo.png' alt='logo' width={186} height={77} />
          </div>

          {/* النموذج */}
          <div className='flex flex-col items-center justify-center h-full space-y-4'>
            {!is2FARequired ? (
              // نموذج تسجيل الدخول
              <form onSubmit={handleLoginSubmit} className='flex flex-col items-center space-y-4'>
                <div dir='rtl'>
                  <Input
                    className='border border-black w-[375px]'
                    type='text'
                    placeholder='اسم المستخدم'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {fieldErrors.username && (
                    <span className='text-red-500 text-sm'>{fieldErrors.username}</span>
                  )}
                </div>

                <div dir='rtl'>
                  <Input
                    className='border border-black w-[375px]'
                    type='password'
                    placeholder='كلمة المرور'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {fieldErrors.password && (
                    <span className='text-red-500 text-sm'>{fieldErrors.password}</span>
                  )}
                </div>

                {error && <span className='text-red-500 text-sm'>{error}</span>}

                <Button
                  type='submit'
                  className='w-[252px] bg-[#45369f] hover:bg-[#5643bd]'
                >
                  تسجيل الدخول
                </Button>
              </form>
            ) : (
              // نموذج التحقق الثنائي (2FA)
              <Form {...form}>
                <form onSubmit={handle2FASubmit} className="w-2/3 space-y-6">
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem className=' flex flex-col items-center justify-center text-center'>
                        <FormLabel>التحقق الثنائي (2FA)</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              {[...Array(6)].map((_, index) => (
                                <InputOTPSlot key={index} index={index} />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة
                        </FormDescription>
                        <FormMessage>
                          {isUnauthorized && 'الرمز غير صحيح'}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className='w-full'>تحقق</Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;