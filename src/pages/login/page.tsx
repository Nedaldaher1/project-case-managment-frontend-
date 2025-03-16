import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/userContext';
import { useNavigate } from 'react-router-dom';
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
  const { 
    login, 
    verify2FA, 
    is2FARequired, 
    error, 
    fieldErrors, 
    isUnauthorized, 
    isLoggedIn,
    tempUserData,
    logout
  } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // إعادة التوجيه إذا كان المستخدم مسجل الدخول
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
    // إعادة التعيين عند تحميل الصفحة إذا كان هناك بيانات مؤقتة
    if (tempUserData) {
      logout();
    }
  }, [ navigate ]);

  // تهيئة useForm للتحقق من صحة رمز 2FA
  const form = useForm<{ pin: string }>({
    resolver: zodResolver(FormSchema),
  });

  // معالجة تسجيل الدخول
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  // معالجة التحقق من رمز 2FA
  const handle2FASubmit = form.handleSubmit(({ pin }) => {
    verify2FA(pin);
  });

  return (
<div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      {!isLoggedIn && (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row" 
             style={{ height: '80vh', maxHeight: '600px' }}>
          
          {/* Left Section */}
          <div className="md:w-1/2 bg-[#45369f] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none 
                          flex items-center justify-center p-4 flex-1">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center font-[Cairo]">
              مرحباً بك
            </h1>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 p-6 relative flex-1 flex flex-col">
            {/* Logo */}
            <div className="absolute top-4 right-4">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-20 md:w-24 lg:w-32" 
              />
            </div>

            {/* Form Container */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {!is2FARequired ? (
                // Login Form
                <form onSubmit={handleLoginSubmit} className="w-full max-w-md space-y-6">
                  {/* Username Field */}
                  <div dir="rtl" className="space-y-2">
                    <Input
                      className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-[#45369f]"
                      placeholder="اسم المستخدم"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {fieldErrors.username && (
                      <p className="text-red-500 text-sm">{fieldErrors.username}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div dir="rtl" className="space-y-2">
                    <Input
                      className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-[#45369f]"
                      type="password"
                      placeholder="كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {fieldErrors.password && (
                      <p className="text-red-500 text-sm">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full py-3 bg-[#45369f] hover:bg-[#5847b5] text-lg"
                  >
                    تسجيل الدخول
                  </Button>
                </form>
              ) : (
                // 2FA Form
                <Form {...form}>
                  <form onSubmit={handle2FASubmit} className="w-full max-w-md space-y-8">
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem className="space-y-4 w-full">
                          <FormLabel className="block text-center text-xl font-semibold text-gray-700">
                            التحقق الثنائي (2FA)
                          </FormLabel>
                          
                          <FormControl>
                            <div className="flex justify-center w-full">
                              <InputOTP 
                                maxLength={6} 
                                {...field}
                                className="gap-2 md:gap-3 w-full justify-between"
                              >
                                <InputOTPGroup className="w-full justify-between">
                                  {[...Array(6)].map((_, index) => (
                                    <InputOTPSlot 
                                      key={index} 
                                      index={index}
                                      className="w-12 h-12 border-2 border-gray-200 text-lg flex-1"
                                    />
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                          </FormControl>

                          <FormDescription className="text-center text-gray-500">
                            أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة
                          </FormDescription>

                          {isUnauthorized && (
                            <FormMessage className="text-center text-red-500">
                              الرمز غير صحيح
                            </FormMessage>
                          )}

                          <Button 
                            type="submit" 
                            className="w-full py-3 bg-[#45369f] hover:bg-[#5847b5] text-lg"
                          >
                            تحقق
                          </Button>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;