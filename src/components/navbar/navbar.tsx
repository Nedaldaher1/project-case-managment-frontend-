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
import { AbilityContext } from '@/context/AbilityContext';
import { Can, useAbility } from '@casl/react';

interface NavbarProps {
    className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
    const { userData, isLoggedIn, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const ability = useAbility(AbilityContext);

    const handleLogout = () => {
        logout();
        logoutSession();
        navigate('/login');
    };

    return (
        <nav dir='rtl' className={`${className} bg-gray-100 py-4 px-6 shadow-sm relative z-50`}>
            <div className="max-w-7xl mx-auto">
                {/* تصميم سطح المكتب */}
                {!isMobile ? (
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <Link to="/" className="col-span-3 flex items-center">
                            <img src="/logo.png" alt="logo" className="w-32 h-auto" />
                        </Link>

                        <div className="col-span-6">
                            <div className="flex  items-center  justify-center gap-4 text-center">
                                {links.slice(0, 3).map((item, index) => (   
                                    <Can key={index} I={item.I} a={item.a} ability={ability}>
                                        {(allowed) => allowed && (
                                            <Link
                                                key={index}
                                                to={item.linkTo}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <span className="font-medium text-gray-700">{item.name}</span>
                                            </Link>
                                        )}

                                    </Can>

                                ))}
                            </div>
                        </div>

                        <div className="col-span-3 flex justify-end items-center gap-4">
                            <div className="text-right">
                                <p className="font-medium text-gray-700">{userData?.username}</p>
                                <p className="text-xs text-gray-500">حالة المستخدم</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar className="border-2 border-gray-300">
                                        <AvatarImage src="/user-circle.svg" />
                                        <AvatarFallback>
                                            {userData?.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-[200px]">
                                    <DropdownMenuLabel>{userData?.username}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 cursor-pointer"
                                    >
                                        تسجيل الخروج
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ) : (
                    /* تصميم الجوال المعدل */
                    <div className="flex justify-between items-center">
                        {/* الشعار */}
                        <Link to="/">
                            <img src="/logo.png" alt="logo" className="w-32 h-auto" />
                        </Link>

                        {/* زر القائمة */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-700 hover:text-blue-600"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>

                        {/* القائمة المنبثقة */}
                        {isMenuOpen && (
                            <div className="fixed inset-0 bg-white z-50 pt-20 px-6">
                                <div className="flex flex-col gap-4">
                                    {/* زر الإغلاق */}
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="absolute top-6 right-6 text-gray-500 hover:text-red-600"
                                    >
                                        <X size={28} />
                                    </button>

                                    {/* الروابط */}
                                    {links.map((item, index) => (
                                        <Link
                                            key={index}
                                            to={item.linkTo}
                                            className="py-3 border-b hover:text-blue-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    {/* حساب المستخدم */}
                                    {isLoggedIn && (
                                        <div className="mt-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="w-full">
                                                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                                                        <Avatar>
                                                            <AvatarImage src="/user-circle.svg" />
                                                            <AvatarFallback>
                                                                {userData?.username?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{userData?.username}</span>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full">
                                                    <DropdownMenuItem
                                                        onClick={handleLogout}
                                                        className="text-red-600"
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
                )}
            </div>
        </nav>
    );
};

export default Navbar;