import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";


const Home = () => {
    const [data, setData] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/archives/office/all`);
            setData(response.data.offices);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto ">
                <h1 className=" h-[100px] text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                    نظام الأرشيف الإلكتروني للأحراز
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.map((office, index) => (
                            <Link
                                key={index}
                                to={`management?type=${office.id}`}
                                className="relative group transform transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:border-indigo-300 transition-all duration-300 h-full flex items-center justify-center overflow-hidden">
                                    {/* Animated background layer */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Floating dots animation */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200 rounded-full animate-float" />
                                        <div className="absolute bottom-4 left-4 w-8 h-8 bg-indigo-200 rounded-full animate-float-delayed" />
                                    </div>

                                    {/* Main content */}
                                    <div className="relative z-10 space-y-4">
                                        <span className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-800 transition-colors duration-300">
                                            {office.name}
                                        </span>
                                        <div className="w-full h-px bg-gray-200 group-hover:bg-indigo-300 transition-colors duration-300" />
                                        <div className="text-sm text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                                            اضغط للدخول →
                                        </div>
                                    </div>

                                    {/* Glowing effect */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur opacity-30 animate-pulse" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;