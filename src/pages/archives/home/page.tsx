import { useEffect, useState } from "react";
import { useAuth } from "@/context/userContext";
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { token, userData } = useAuth();


  // تحويل البيانات إلى مصفوفة آمنة مع قيمة افتراضية
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">


        <h1 className="h-[100px] text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient-x">
          نظام الأرشيف الإلكتروني للأحراز
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
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
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 h-full flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200 dark:bg-indigo-600 rounded-full animate-float" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-indigo-200 dark:bg-blue-600 rounded-full animate-float-delayed" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-800 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {office.name}
                    </span>
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-500 transition-colors duration-300" />
                    <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors duration-300">
                      اضغط للدخول →
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-gray-600 dark:to-gray-700 rounded-2xl blur opacity-30 animate-pulse" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-300 text-xl">
              لا توجد مكاتب متاحة للعرض حالياً
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              الرجاء التواصل مع المسؤول لإضافة الصلاحيات اللازمة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
