import { Link, useSearchParams } from "react-router-dom";
import '@/globle.scss';

const Management = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                
                {/* قسم الإطلاع */}
                <Link 
                    to={`data?type=${type}`} 
                    className="relative group h-72 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-105 shadow-xl 
                        bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg 
                        border-2 border-blue-200/40 dark:border-gray-700/40 
                        hover:border-blue-300/60 dark:hover:border-gray-600/60"
                >
                    <div className="absolute inset-0 
                        bg-gradient-to-br from-blue-100/70 via-blue-200/50 to-blue-300/40 
                        dark:from-gray-700/60 dark:via-gray-600/50 dark:to-gray-800/40 
                        opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute inset-0 animate-light-sweep opacity-0 group-hover:opacity-30" />

                    <span className="absolute inset-0 flex items-center justify-center 
                        text-5xl font-extrabold text-blue-900/90 dark:text-gray-100 
                        z-10 transition-all duration-500 group-hover:text-6xl group-hover:text-blue-900 dark:group-hover:text-white"
                    >
                        الاطلاع
                        <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent 
                            dark:from-white/10 
                            opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    </span>

                    <div className="absolute inset-0 border-[3px] border-blue-200/40 dark:border-gray-700/30 rounded-[2.5rem] transition-all duration-500 
                        group-hover:border-blue-400/50 dark:group-hover:border-gray-600/50" />
                </Link>

                {/* قسم الإدخال */}
                <Link 
                    to={`insert?type=${type}`} 
                    className="relative group h-72 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-105 shadow-xl 
                        bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg 
                        border-2 border-blue-200/40 dark:border-gray-700/40 
                        hover:border-blue-300/60 dark:hover:border-gray-600/60"
                >
                    <div className="absolute inset-0 
                        bg-gradient-to-br from-blue-100/70 via-blue-200/50 to-blue-400/40 
                        dark:from-gray-700/60 dark:via-gray-600/50 dark:to-gray-900/40 
                        opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute inset-0 animate-light-sweep opacity-0 group-hover:opacity-30" />

                    <span className="absolute inset-0 flex items-center justify-center 
                        text-5xl font-extrabold text-blue-900/90 dark:text-gray-100 
                        z-10 transition-all duration-500 group-hover:text-6xl group-hover:text-blue-900 dark:group-hover:text-white"
                    >
                        الإدخال
                        <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent 
                            dark:from-white/10 
                            opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    </span>

                    <div className="absolute inset-0 border-[3px] border-blue-200/40 dark:border-gray-700/30 rounded-[2.5rem] transition-all duration-500 
                        group-hover:border-blue-400/50 dark:group-hover:border-gray-600/50" />
                </Link>
            </div>
        </div>
    );
};

export default Management;
