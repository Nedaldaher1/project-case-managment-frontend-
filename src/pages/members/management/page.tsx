import { Link, useSearchParams } from "react-router-dom";
import '@/globle.scss';
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from 'react-redux';

const Management = () => {
    const [searchParams] = useSearchParams();
    
    const type = decodeURIComponent(searchParams.get('type') || '');
    const name = decodeURIComponent(searchParams.get('name') || '');
    const isDarkMode = useSelector(selectDarkMode);

    const buildLink = (path: string) => {
        const params = new URLSearchParams();
        if (type) params.append('type', encodeURIComponent(type));
        if (name) params.append('name', encodeURIComponent(name));
        return `/case/members${path}?${params.toString()}`;
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${
            isDarkMode 
            ? 'bg-gradient-to-br from-[#1F2937] to-[#111827]' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100'
        }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                
                <Link 
                    to={buildLink('/data')}
                    className={`relative group h-72 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-105 shadow-xl backdrop-blur-lg border-2 ${
                        isDarkMode
                        ? 'bg-[#1F2937]/40 border-[#374151]/40 hover:border-[#60A5FA]/60'
                        : 'bg-white/40 border-blue-200/40 hover:border-blue-300/60'
                    }`}
                >
                    <div className={`absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100 ${
                        isDarkMode
                        ? 'bg-gradient-to-br from-[#1F2937]/70 via-[#374151]/50 to-[#1F2937]/40'
                        : 'bg-gradient-to-br from-blue-100/70 via-blue-200/50 to-blue-300/40'
                    }`} />

                    <div className={`absolute inset-0 animate-light-sweep opacity-0 group-hover:opacity-30 ${
                        isDarkMode ? 'bg-gradient-to-r from-[#818CF8]/20 to-[#60A5FA]/10' : ''
                    }`} />

                    <span className={`absolute inset-0 flex items-center justify-center text-5xl font-extrabold z-10 transition-all duration-500 group-hover:text-6xl ${
                        isDarkMode
                        ? 'text-[#E5E7EB]/90 group-hover:text-[#93C5FD]'
                        : 'text-blue-900/90 group-hover:text-blue-900'
                    }`}>
                        الاطلاع
                        <span className={`absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                            isDarkMode 
                            ? 'bg-gradient-to-b from-[#374151]/30 to-transparent' 
                            : 'bg-gradient-to-b from-white/30 to-transparent'
                        }`} />
                    </span>

                    <div className={`absolute inset-0 border-[3px] rounded-[2.5rem] transition-all duration-500 ${
                        isDarkMode
                        ? 'border-[#374151]/40 group-hover:border-[#60A5FA]/50'
                        : 'border-blue-200/40 group-hover:border-blue-400/50'
                    }`} />
                </Link>

                <Link 
                    to={buildLink('/add')}
                    className={`relative group h-72 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-105 shadow-xl backdrop-blur-lg border-2 ${
                        isDarkMode
                        ? 'bg-[#1F2937]/40 border-[#374151]/40 hover:border-[#60A5FA]/60'
                        : 'bg-white/40 border-blue-200/40 hover:border-blue-300/60'
                    }`}
                >
                    <div className={`absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100 ${
                        isDarkMode
                        ? 'bg-gradient-to-br from-[#1F2937]/70 via-[#374151]/50 to-[#1F2937]/40'
                        : 'bg-gradient-to-br from-blue-100/70 via-blue-200/50 to-blue-400/40'
                    }`} />

                    <div className={`absolute inset-0 animate-light-sweep opacity-0 group-hover:opacity-30 ${
                        isDarkMode ? 'bg-gradient-to-r from-[#818CF8]/20 to-[#60A5FA]/10' : ''
                    }`} />

                    <span className={`absolute inset-0 flex items-center justify-center text-5xl font-extrabold z-10 transition-all duration-500 group-hover:text-6xl ${
                        isDarkMode
                        ? 'text-[#E5E7EB]/90 group-hover:text-[#93C5FD]'
                        : 'text-blue-900/90 group-hover:text-blue-900'
                    }`}>
                        الإدخال
                        <span className={`absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                            isDarkMode 
                            ? 'bg-gradient-to-b from-[#374151]/30 to-transparent' 
                            : 'bg-gradient-to-b from-white/30 to-transparent'
                        }`} />
                    </span>

                    <div className={`absolute inset-0 border-[3px] rounded-[2.5rem] transition-all duration-500 ${
                        isDarkMode
                        ? 'border-[#374151]/40 group-hover:border-[#60A5FA]/50'
                        : 'border-blue-200/40 group-hover:border-blue-400/50'
                    }`} />
                </Link>
            </div>
        </div>
    );
};

export default Management;