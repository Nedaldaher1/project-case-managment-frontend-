import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

const Footer: FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <footer className="w-full bg-gray-100 py-6 md:py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center">
                    {/* الشعار */}
                    <div className="order-3 md:order-1">
                        <img 
                            src="/logo.png" 
                            alt="logo"
                            className="w-24 md:w-32 h-auto cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleNavigation('/')}
                        />
                    </div>

                    {/* اسم المنظومة */}
                    <div className="order-1 md:order-2">
                        <h2 
                            onClick={() => handleNavigation('/')}
                            className="text-lg md:text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                            منظومة تيسير الاعمال
                        </h2>
                    </div>

                    {/* حقوق النشر */}
                    <div className="order-2 md:order-3">
                        <p className="text-sm md:text-base text-gray-600">
                            © 2024 جميع الحقوق محفوظة<br className="md:hidden"/>
                            <span className="hidden md:inline"> - </span>
                            منظومة تيسير الاعمال
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;