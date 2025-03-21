import { Route, Routes, Outlet } from 'react-router-dom';
import { Suspense, lazy, JSX } from 'react';
import NavBar from '@/components/navbar/navbar';
import NavbarAdmin from '@/components/admin/SiderBarAdmin/SiderBarAdmin';
import Footer from '@/components/footer/footer';
import ProtectedRoute from './routes/ProtectedRoute';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from './context/userContext';

const Login = lazy(() => import('./pages/login/page'));
const NotFoundPage = lazy(() => import('@/pages/404/not-found'));
const AddCasePublic = lazy(() => import('@/pages/public/add/page'));
const ManagementCasePublic = lazy(() => import('@/pages/private/management/page'));
const HomePagePublic = lazy(() => import('@/pages/public/home/page'));
const AddCasePrivate = lazy(() => import('@/pages/private/add/page'));
const HomePagePrivate = lazy(() => import('@/pages/private/home/page'));
const ManagementCasePrivate = lazy(() => import('@/pages/public/management/page'));
const Home = lazy(() => import('@/pages/homePage'));
const Archives = lazy(() => import('@/pages/archives/home/page'));
const ArchivesManagement = lazy(() => import('@/pages/archives/management/page'));
const ArchiveInsert = lazy(() => import('@/pages/archives/management/insert/page'));
const ArchivesDataManagement = lazy(() => import('@/pages/archives/management/data_management/page'));
const UnauthorizedPage = lazy(() => import('@/pages/unauthorized/page'));

const App = () => {
    const { isLoggedIn, userData } = useAuth();
    const isAdmin = userData?.role === 'admin';
    const isEditor = userData?.role === 'editor';
    
    const RoleProtectedRoute = ({ children }: { children: JSX.Element }) => {
        if (!isAdmin && !isEditor) {
            return <UnauthorizedPage />;
        }
        return children;
    };

    return (
        <SidebarProvider>
            <div className={`${isLoggedIn && isAdmin ? 'grid grid-rows-[1fr_auto] grid-cols-[auto_1fr]' : ''} w-screen min-h-screen`}>
                {/* عرض الناف بار فقط عند تسجيل الدخول */}
                {isLoggedIn && (isAdmin ? <NavbarAdmin /> : <NavBar />)}
                
                <main className={`${isLoggedIn && isAdmin ? 'col-auto' : ''} w-full h-full`}>
                    {isLoggedIn && isAdmin && <SidebarTrigger />}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            {/* مسارات لا تتطلب تسجيل دخول */}
                            <Route path="/login" element={!isLoggedIn ? <Login /> : <Home />} />
                            
                            {/* مسارات محمية بتسجيل الدخول */}
                            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                                <Route path="/" element={<Home />} />
                                
                                <Route path="/case/public/*" element={<Outlet />}>
                                    <Route path="add" element={<AddCasePublic />} />
                                    <Route path="management" element={<ManagementCasePrivate />} />
                                    <Route path="home" element={<HomePagePublic />} />
                                    <Route path="archives/*" element={<Outlet />}>
                                        <Route index element={<Archives />} />
                                        <Route path="management" element={<ArchivesManagement />} />
                                        <Route path="management/insert" element={<ArchiveInsert />} />
                                        <Route path="management/data" element={<ArchivesDataManagement />} />
                                    </Route>
                                </Route>

                                <Route path="/case/private/*" element={
                                    <RoleProtectedRoute>
                                        <Outlet />
                                    </RoleProtectedRoute>
                                }>
                                    <Route path="management" element={<ManagementCasePublic />} />
                                    <Route path="add" element={<AddCasePrivate />} />
                                    <Route path="home" element={<HomePagePrivate />} />
                                </Route>
                            </Route>

                            <Route path="/unauthorized" element={<UnauthorizedPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </main>

                {/* التذييل يظهر فقط عند تسجيل الدخول */}
                {isLoggedIn && (
                    <footer className={`${isAdmin ? 'col-span-2' : ''}`}>
                        <Footer />
                    </footer>
                )}
            </div>
        </SidebarProvider>
    );
}

export default App;