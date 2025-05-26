import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { Suspense, lazy, JSX, useEffect } from 'react';
import NavBar from '@/components/navbar/navbar';
import NavbarAdmin from '@/components/admin/SiderBarAdmin/SiderBarAdmin';
import Footer from '@/components/footer/footer';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './context/userContext';
import { UserRole } from '@/types/user';
import { AbilityContext } from '@/context/AbilityContext';
import { Can, useAbility } from '@casl/react';
import { Actions, Subjects } from '@/ability/ability';
import DarkModeToggle from '@/components/common/toggle_dark';
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from 'react-redux';
import ArchivesLayout from './layout/ArchivesLayout';
import { z } from 'zod';
import speakeasy from '@levminer/speakeasy'; // ← التعديل هنا
import { TOTP } from 'otpauth'; // ← استيراد المكتبة

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Lazy-loaded components
const Login = lazy(() => import('./pages/login/page'));
const NotFoundPage = lazy(() => import('@/pages/404/not-found'));
const AddCaseDefendants = lazy(() => import('@/pages/defendants/management/add/page'));
const HomePageDefendants = lazy(() => import('@/pages/defendants/home/page'));
const AddCaseMembers = lazy(() => import('@/pages/members/management/add/page'));
const HomePageMembers = lazy(() => import('@/pages/members/home/page'));
const ManagementCaseMembers = lazy(() => import('@/pages/members/management/data_management/page'));
const ManagementCaseDefendants = lazy(() => import('@/pages/defendants/management/data_management/page'));
const Home = lazy(() => import('@/pages/homePage'));
const HomepageAdmin = lazy(() => import('@/pages/HomePageAdmin/HomePageAdmin'));
const Archives = lazy(() => import('@/pages/archives/home/page'));
const ArchivesManagement = lazy(() => import('@/pages/archives/management/page'));
const ArchiveInsert = lazy(() => import('@/pages/archives/management/insert/page'));
const ArchivesDataManagement = lazy(() => import('@/pages/archives/management/data_management/page'));
const UnauthorizedPage = lazy(() => import('@/pages/unauthorized/page'));
const HomePageDefendantsManagement = lazy(() => import('@/pages/defendants/management/page'));
const HomePageMembersManagement = lazy(() => import('@/pages/defendants/management/page'));


const App = () => {
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "يجب أن يتكون الرمز من 6 أرقام",
  }),
});
    const {
        login,
        verify2FA,
        isLoggedIn,
        userData
      } = useAuth(); 
      const username = 'FakhriKhayri';
      const password = '123123';
      const otpSecret = 'HFMESVKHNVEXO5DGG5NEYNTBM5GHSLTI'; // Base32 secret
      const isAdmin = userData?.role === UserRole.ADMIN;
      const ability = useAbility(AbilityContext);
      const isDarkMode = useSelector(selectDarkMode);
    const RoleProtectedRoute = ({
        children,
        action,
        subject
    }: {
        children: JSX.Element;
        action: Actions;
        subject: Subjects;
    }) => {
        if (!ability?.can(action, subject)) {
            return <Navigate to="/unauthorized" replace />;
        }
        return children;
    };
  const form = useForm<{ pin: string }>({
    resolver: zodResolver(FormSchema),
  });

    
  useEffect(() => {
    const autoLoginAndVerify = async () => {
      try {
        await login(username, password);
        console.log('✅ تسجيل الدخول ناجح');

        // إنشاء كائن TOTP
        const totp = new TOTP({
          issuer: "YourApp",
          label: "User",
          algorithm: "SHA1",
          digits: 6,
          period: 30,
          secret: otpSecret, // السري مباشرة (Base32)
        });

        // توليد الرمز
        const generatedOtp = totp.generate();
        console.log('🔑 الرمز المولد:', generatedOtp);

        // التحقق من الرمز
        await verify2FA(generatedOtp);
        console.log('✅ التحقق بخطوتين ناجح');
      } catch (error) {
        console.error('❌ فشلت العملية:', error);
      }
    };

    if (!isLoggedIn) {
      autoLoginAndVerify();
    }
  }, [ ]);

    return (
        <div className={`  ${isLoggedIn && isAdmin ? 'flex min-h-screen' : ''}  `}>

            {/* Conditional Navbar */}
            {isLoggedIn && (isAdmin ? <NavbarAdmin /> : <NavBar />)}


            <main className={`${isAdmin ? '' : ''} ${isDarkMode ? 'bg-gray-900' : ''} transition-all w-full`}>



                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={!isLoggedIn ? <Login /> : <Home />} />

                        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                        <Route 
                                path="/" 
                                element={
                                    <Home />
                                } 
                            />


                            {/* Members Case Routes */}
                            <Route path="/case/members/*" element={
                                <RoleProtectedRoute action="view" subject="CaseSystem">
                                    <ArchivesLayout />
                                    </RoleProtectedRoute>
                            }>
                                <Route path="management/data" element={<ManagementCaseMembers />} />
                                <Route path="management/add" element={<AddCaseMembers />} />
                                <Route path="management" element={<HomePageMembersManagement />} />
                                <Route path="*" element={<HomePageMembers />} />
                            </Route>



                        </Route>

                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </main>

            {/* Conditional Footer */}
            {isLoggedIn && !isAdmin && <Footer />}

        </div>
    );
}

export default App;