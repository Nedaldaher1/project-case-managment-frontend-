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
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from 'react-redux';

interface NavbarProps {
    className?: string;
}
interface UserData {
    username?: string;
    officesAvailable?: Array<{
        id: string;
        name: string;
    }>;
}
const Navbar = ({ className }: NavbarProps) => {
    const { userData, logout } = useAuth() as any;
    const isDarkMode = useSelector(selectDarkMode);
    const navigate = useNavigate();
    const ability = useAbility(AbilityContext);
    const IdOffice = (userData?.officesAvailable as UserData['officesAvailable'])?.[0]?.id;
    const handleLogout = () => {
        logout();
        logoutSession();
        navigate('/login');
    };

    return (
        <nav dir='rtl' className={` bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] py-4 px-6 shadow-sm relative z-50 transition-colors text-white ${className}`}>
            <div className="max-w-7xl mx-auto">
                {/* تصميم سطح المكتب */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <Link to="/" className="col-span-3 flex items-center">
                        <span className="text-white text-xl font-bold mr-2">منظومة تيسير الاعمال </span>
                    </Link>


                    <div className="col-span-6">
                        <div className="flex  items-center  justify-center gap-4 text-center">
                            {links.slice(0, 3).map((item, index) => (
                                <Can key={index} I={item.I} a={item.a} ability={ability}>
                                    {(allowed) => allowed && (
                                        <>
                                            <DropdownMenu dir='rtl'>
                                                <DropdownMenuTrigger>
                                                    <span className={`text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center relative `}>{item.name}</span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className={` min-w-[200px] bg-white  ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''}`}>
                                                    <DropdownMenuLabel>الصفحات</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <Link to={`${item.linkTo}/management/add?type=${IdOffice}`} className="text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">

                                                        <DropdownMenuItem
                                                        >
                                                            الادخال
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link to={`${item.linkTo}/management/data?type=${IdOffice}`} className="text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                                                        <DropdownMenuItem
                                                        >
                                                            الاطلاع
                                                        </DropdownMenuItem>

                                                    </Link>




                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )}


                                </Can>

                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 flex justify-end items-center gap-4">

                        <DropdownMenu dir='rtl'>
                            <DropdownMenuTrigger>
                                <Avatar >
                                    <AvatarImage className="rounded-full" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
                                    <AvatarFallback className="text-white mr-2 ml-1">
                                        {userData?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={` min-w-[200px] bg-white  ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''}`}>
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
                        <div className="text-right">
                            <p className={`font-medium text-gray-100 `}>{userData?.username}</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;