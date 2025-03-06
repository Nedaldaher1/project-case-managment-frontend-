import { Route, Routes, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import NavBar from '@/components/navbar/navbar';
import NavbarAdmin from '@/components/admin/SiderBarAdmin/SiderBarAdmin';
import Footer from '@/components/footer/footer';
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedRouteDashbord from './routes/ProtectedRouteDashbord';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { useUser } from './context/userContext';

const Login = lazy(() => import('./pages/login/page'));
const NotFoundPage = lazy(() => import('@/pages/404/not-found'));
const AddCasePublic = lazy(() => import('@/pages/public/add/page'));
const ManagementCasePublic = lazy(() => import('@/pages/private/management/page'));
const HomePagePublic = lazy(() => import('@/pages/public/home/page'));
const AddCasePrivate = lazy(() => import('@/pages/private/add/page'));
const HomePagePrivate = lazy(() => import('@/pages/private/home/page'));
const ManagementCasePrivate = lazy(() => import('@/pages/public/management/page'));
const Home = lazy(() => import('@/pages/homePage'));
const GetUser = lazy(() => import('@/pages/dashboard/users/page'));
const BackupPage = lazy(() => import('@/pages/dashboard/backups/page'));
const Archives = lazy(() => import('@/pages/archives/home/page'));
const Profile = lazy(() => import('@/pages/dashboard/profile/page'));
const App = () => {
    const { isLoggedIn, isAdmin } = useUser();


    return (
        isAdmin ? (
            // Layout for admin user
            <SidebarProvider className=''>
                <div className="grid grid-rows-[1fr_auto] grid-cols-[auto_1fr] w-screen min-h-screen">
                    {/* Sidebar */}
                    {
                        isLoggedIn ? <NavbarAdmin /> : <Outlet />
                    }


                    {/* Main Content */}
                    <main className="   w-full h-full   col-auto ">
                        <SidebarTrigger />
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="*" element={<NotFoundPage />} />
                                    <Route path="/case/public/add" element={<AddCasePublic />} />
                                    <Route path="/case/public/management" element={<ManagementCasePrivate />} />
                                    <Route path="/case/public/home" element={<HomePagePublic />} />
                                    <Route path="/case/private/management" element={<ManagementCasePublic />} />
                                    <Route path="/case/private/add" element={<AddCasePrivate />} />
                                    <Route path="/case/private/home" element={<HomePagePrivate />} />
                                </Route>
                                <Route element={<ProtectedRouteDashbord><Outlet /></ProtectedRouteDashbord>}>
                                    <Route path="/dashboard/users" element={<GetUser />} />
                                    <Route path="/dashboard/backups" element={<BackupPage />} />
                                </Route>
                                {
                                    !isLoggedIn && (
                                        <Route path="/login" element={<Login />} />
                                    )
                                }
                            </Routes>
                        </Suspense>
                    </main>

                    {/* Footer */}
                    <footer className="col-span-2">
                        <Footer />
                    </footer>
                </div>
            </SidebarProvider>
        ) : (
            // Layout for non-admin user
            <>
                <NavBar />
                <main className={`${isAdmin ? 'bg-gray-100' : 'bg-white'} min-h-[calc(100vh-4rem)]`}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                                <Route path="/" element={<Home />} />
                                <Route path="*" element={<NotFoundPage />} />
                                <Route path="/case/public/add" element={<AddCasePublic />} />
                                <Route path="/case/public/management" element={<ManagementCasePrivate />} />
                                <Route path="/case/public/home" element={<HomePagePublic />} />
                                <Route path="/case/private/management" element={<ManagementCasePublic />} />
                                <Route path="/case/private/add" element={<AddCasePrivate />} />
                                <Route path="/case/private/home" element={<HomePagePrivate />} />
                                <Route path="/case/public/archives" element={<Archives />} />

                            </Route>
                            <Route element={<ProtectedRouteDashbord><Outlet /></ProtectedRouteDashbord>}>
                                <Route path="/dashboard" element={<ManagementCasePrivate />} />
                            </Route>
                            {
                                !isLoggedIn && (
                                    <Route path="/login" element={<Login />} />
                                )
                            }
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </>
        )
    );
}

export default App;
