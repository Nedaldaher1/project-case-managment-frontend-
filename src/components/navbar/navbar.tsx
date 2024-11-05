import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
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
import { useUser } from '@/context/userContext';
import './style.scss';

export default function Navbar() {
    const username = Cookies.get('username');
    const userContext = useUser();
    const { isLoggedIn, logout  } = userContext;
    const Navigate = useNavigate();


    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <div className='flex flex-row-reverse items-center justify-center gap-5 space-y-2'>
                        <h1>نيابة اجا الجزئية</h1>
                        {
                            isLoggedIn && (
                                <DropdownMenu >
                                    <DropdownMenuTrigger className='select-none'>
                                        <Avatar>
                                            <AvatarImage src="/user-circle.svg" />
                                            <AvatarFallback>admin</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Hello {username}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                          logout();
                                        }}>logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }
                    </div>
                </li>
                <li>
                    <div className="flex flex-row justify-center items-center cursor-pointer gap-3">
                        {
                            isLoggedIn ? (
                                links.map((link) => (
                                    <Link key={link} to={link === 'تجديد المتهمين' ? '/case/public/home' : '/case/private/home'} className='text-lg'>{link}</Link>
    
                                ))
                            ):(
                                <></>
                            )
                        }
                    </div>
                </li>
                <li>
                    <a href='/'>
                        <img src='/logo.png' alt='logo' width={242} height={100} />
                    </a>
                </li>
            </ul>
        </nav>
    );
}
