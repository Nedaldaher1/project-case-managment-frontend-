import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/userContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WaveAnimation from '@/components/animation/WaveAnimation';
import {
  InputOTP,
  InputOTPGroup,
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
import { GoLaw } from 'react-icons/go';
import './styles.scss'

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

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
    // إعادة التعيين عند تحميل الصفحة إذا كان هناك بيانات مؤقتة
    if (tempUserData) {
      logout();
    }
  }, [navigate]);

  const form = useForm<{ pin: string }>({
    resolver: zodResolver(FormSchema),
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  const handle2FASubmit = form.handleSubmit(({ pin }) => {
    verify2FA(pin);
  });

  return (
    <div dir='rtl' className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Wave Background */}
      <div className="absolute bottom-0 w-full wave-animation  z-10">
        <svg
          viewBox="0 0 2 1"
          preserveAspectRatio="none">
          <defs>
            <path id="w"
              d="
      m0 1v-.5 
      q.5.5 1 0
      t1 0 1 0 1 0
      v.5z" />
          </defs>
          <g>
            <use href="#w" y=".0" fill="#2d55aa" />
            <use href="#w" y=".1" fill="#3461c1" />
            <use href="#w" y=".2" fill="#4579e2" />
          </g>
        </svg>      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white rounded-2xl w-full max-w-md z-10 shadow-xl"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        <div className="p-8">
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="logo bg-white p-4 rounded-full shadow-lg mb-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="wave-wrapper-logo">

                <div className="wave-logo one"></div>
                <div className="wave-logo two"></div>
                <div className="wave-logo three"></div>
               <img src="/logo void.png" alt="Logo" className="w-16 h-16 Z-[50] relative" />

              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-blue-800">  الدليل الإرشادي لقضايا الاعضاء </h1>
            <p className="text-blue-600 mt-2">تسجيل الدخول للوحة التحكم</p>
          </motion.div>

          {!is2FARequired ? (
            <motion.form
              onSubmit={handleLoginSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue-700 mb-1">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-400">
                    <i className="fas fa-user"></i>
                  </div>
                  <Input
                    id="username"
                    className="w-full pr-10 pl-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-700"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {fieldErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-400">
                    <i className="fas fa-lock"></i>
                  </div>
                  <Input
                    type="password"
                    id="password"
                    className="w-full pr-10 pl-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-700"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                تسجيل الدخول
                <i className="fas fa-sign-in-alt mr-2"></i>
              </Button>
            </motion.form>
          ) : (
            <Form {...form}>
              <motion.form
                onSubmit={handle2FASubmit}
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem className="space-y-4 w-full">
                      <FormLabel className="block text-center text-xl font-semibold text-blue-800">
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
                                  className="w-12 h-12 border-2 border-blue-200 bg-white text-gray-900"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>

                      <FormDescription className="text-center text-blue-600">
                        أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة
                      </FormDescription>

                      {isUnauthorized && (
                        <FormMessage className="text-center text-red-500">
                          الرمز غير صحيح
                        </FormMessage>
                      )}

                      <Button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        تحقق
                      </Button>
                    </FormItem>
                  )}
                />
              </motion.form>
            </Form>
          )}

          <motion.div
            className="mt-6 text-center text-sm text-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p>ليس لديك حساب؟ <a href="#" className="font-medium text-blue-700 hover:text-blue-800">تواصل مع المسؤول</a></p>
          </motion.div>
        </div>

        <div className="px-8 py-4 bg-blue-50 border-t border-blue-100 text-center">
          <motion.p
            className="text-xs text-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2025 جميع الحقوق محفوظة<br className="md:hidden" />
            <span className="hidden md:inline"> - </span>
             الدليل الإرشادي لقضايا الاعضاء
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;