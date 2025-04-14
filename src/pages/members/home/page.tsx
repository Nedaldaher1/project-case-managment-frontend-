import { useEffect, useState } from "react";
import { useAuth } from "@/context/userContext";
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-hot-toast";
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from 'react-redux';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const { token, userData } = useAuth();
    const isDarkMode = useSelector(selectDarkMode);
    
    const officesAvailable: { id: string; name: string }[] = 
        (userData?.officesAvailable as { id: string; name: string }[] | undefined) || [];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                if (!userData?.officesAvailable) {
                    toast.error('حدث خطأ أثناء جلب البيانات');
                }
            } catch (error) {
                console.error('فشل في جلب البيانات:', error);
                toast.error('حدث خطأ أثناء جلب البيانات');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [token, userData]);

    return (
        <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${
            isDarkMode 
            ? 'bg-gradient-to-b from-[#1F2937] to-[#111827]' 
            : 'bg-gradient-to-b from-blue-50 to-indigo-50'
        }`}>
            <div className="max-w-7xl mx-auto">
                <h1 className={`h-[100px] text-4xl md:text-6xl font-bold text-center mb-16 ${
                    isDarkMode
                    ? 'bg-gradient-to-r from-[#818CF8] to-[#60A5FA]'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                } bg-clip-text text-transparent animate-gradient-x`}>
                    نظام قضايا الاعضاء
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`h-32 rounded-2xl animate-pulse ${
                                isDarkMode ? 'bg-[#374151]' : 'bg-gray-200'
                            }`} />
                        ))}
                    </div>
                ) : officesAvailable.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {officesAvailable.map((office) => (
                            <Link
                                key={office.id}
                                to={`management?type=${office.id}`}
                                className="relative group transform transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`relative p-8 rounded-2xl shadow-lg border transition-all duration-300 h-full flex items-center justify-center overflow-hidden ${
                                    isDarkMode
                                    ? 'bg-[#1F2937] border-[#374151] hover:border-[#60A5FA]'
                                    : 'bg-white border-blue-100 hover:border-indigo-300'
                                }`}>
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                        isDarkMode
                                        ? 'bg-gradient-to-br from-[#1F2937] to-[#111827]'
                                        : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                                    }`} />
                                    
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full animate-float ${
                                            isDarkMode ? 'bg-[#4F46E5]' : 'bg-blue-200'
                                        }`} />
                                        <div className={`absolute bottom-4 left-4 w-8 h-8 rounded-full animate-float-delayed ${
                                            isDarkMode ? 'bg-[#2563EB]' : 'bg-indigo-200'
                                        }`} />
                                    </div>

                                    <div className="relative z-10 space-y-4">
                                        <span className={`text-2xl font-semibold transition-colors duration-300 ${
                                            isDarkMode
                                            ? 'text-[#E5E7EB] group-hover:text-[#93C5FD]'
                                            : 'text-gray-800 group-hover:text-indigo-800'
                                        }`}>
                                            {office.name}
                                        </span>
                                        <div className={`w-full h-px transition-colors duration-300 ${
                                            isDarkMode
                                            ? 'bg-[#374151] group-hover:bg-[#60A5FA]'
                                            : 'bg-gray-200 group-hover:bg-indigo-300'
                                        }`} />
                                        <div className={`text-sm transition-colors duration-300 ${
                                            isDarkMode
                                            ? 'text-[#9CA3AF] group-hover:text-[#93C5FD]'
                                            : 'text-gray-500 group-hover:text-indigo-500'
                                        }`}>
                                            اضغط للدخول →
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className={`absolute -inset-1 rounded-2xl blur opacity-30 animate-pulse ${
                                            isDarkMode
                                            ? 'bg-gradient-to-r from-[#4F46E5] to-[#2563EB]'
                                            : 'bg-gradient-to-r from-blue-200 to-indigo-200'
                                        }`} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className={`text-xl ${
                            isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'
                        }`}>
                            لا توجد مكاتب متاحة للعرض حالياً
                        </p>
                        <p className={`mt-2 ${
                            isDarkMode ? 'text-[#6B7280]' : 'text-gray-400'
                        }`}>
                            الرجاء التواصل مع المسؤول لإضافة الصلاحيات اللازمة
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;