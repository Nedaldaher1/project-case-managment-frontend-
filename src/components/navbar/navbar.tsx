import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { links } from '@/data/navbarName';
import { useAuth } from '@/context/userContext';
import { logoutSession } from '@/api/authApi';

interface NavbarProps {
    className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
    const { userData, isLoggedIn, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        logoutSession();
        navigate('/login');
    };

    return (
        <nav className={`${className} bg-gray-100 py-4 px-6 shadow-sm relative z-50`}>
            <div className="max-w-7xl mx-auto">
                {/* Grid Container */}
                <div className="grid grid-cols-12 items-center gap-4">
                    {/* الشعار - الجزء الأيسر */}
                    <Link
                        to="/"
                        className="col-span-4 md:col-span-3 lg:col-span-2 z-50"
                    >
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="w-32 md:w-40 h-auto transition-transform hover:scale-105"
                        />
                    </Link>

                    {/* العناصر الوسطى - Grid فرعي */}
                    {isLoggedIn && !isMobile && (
                        <div className="col-span-4 md:col-span-6 lg:col-span-8">
                            <div className="grid grid-cols-3 gap-4">
                                {/* العنصر الأول */}
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="text-sm font-medium text-gray-700">القسم الأول</span>
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* العنصر الثاني */}
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="text-sm font-medium text-gray-700">القسم الثاني</span>
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* العنصر الثالث */}
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="text-sm font-medium text-gray-700">القسم الثالث</span>
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* الجزء الأيمن - حساب المستخدم */}
                    <div className="col-span-8 md:col-span-3 lg:col-span-2 flex justify-end">
                        {isMobile && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 z-50 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {isMenuOpen ? <></> : <Menu size={28} />}
                            </button>
                        )}

                        {!isMobile && isLoggedIn && (
                            <div className="flex items-center gap-4">
                                {/* نص فوق نص */}
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">{userData?.username}</p>
                                    <p className="text-xs text-gray-500">مستخدم نشط</p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar className="border-2 border-blue-100 hover:border-blue-200 transition-colors w-10 h-10">
                                            <AvatarImage
                                                src="/user-circle.svg"
                                                className="object-contain"
                                            />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                {userData?.username?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="shadow-xl border border-gray-100">
                                        <DropdownMenuLabel className="px-4 py-2">
                                            <div className="space-y-1">
                                                <p className="font-medium">{userData?.username}</p>
                                                <p className="text-xs text-gray-500">آخر دخول: اليوم</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            تسجيل الخروج
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* القائمة المتنقلة */}
                    {isMobile && (
                        <div className={`fixed inset-0 bg-white/95 backdrop-blur-sm pt-24 pb-8 px-6 transition-all duration-300 z-40
                            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        >
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-red-600"
                            >
                                <X size={28} />
                            </button>

                            <div className="grid grid-cols-2 gap-6">
                                {links.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.linkTo}
                                        className="p-4 text-center bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="space-y-2">
                                            <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                    </Link>
                                ))}
                                {isLoggedIn && (
                                    <div className={`${isMobile ? 'p-4 text-center bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors' : 'ml-6'}`}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="select-none focus:outline-none">
                                                <Avatar className="border-2 border-blue-100 hover:border-blue-200 transition-colors w-10 h-10">
                                                    <AvatarImage
                                                        src="/user-circle.svg"
                                                        className="object-contain"
                                                    />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                        {userData?.username?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="min-w-[200px] shadow-xl border border-gray-100"
                                            >
                                                <DropdownMenuLabel className="text-gray-700 font-normal px-4 py-2">
                                                    مرحبًا {userData?.username}
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-gray-100" />
                                                <DropdownMenuItem
                                                    onClick={handleLogout}
                                                    className="text-red-600 cursor-pointer font-medium hover:bg-red-50 px-4 py-2"
                                                >
                                                    تسجيل الخروج
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;