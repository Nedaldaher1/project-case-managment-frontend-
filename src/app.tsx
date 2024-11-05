import { Route, Routes, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import ProtectedRoute from './routes/ProtectedRoute';
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


const App = () => {
    const { isLoggedIn } = useUser();
    return (
        <>
            <NavBar />
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
                    {
                        !isLoggedIn && (
                            <Route path="/login" element={<Login />} />
                        )
                    }
                </Routes>
            </Suspense>
            <Footer />
        </>
    );
}

export default App;
