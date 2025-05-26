import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft, Scale } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const LawSystem: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);
  const navigate = useNavigate();
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);


  const loadingMessages = [
    "جاري إعداد النظام القضائي...",
    "نقوم بتحميل الأدلة الإرشادية...",
    "تهيئة الذكاء الاصطناعي...",
    "كل شيء جاهز!",
  ];

  // التحقق من وجود زيارة سابقة
  useEffect(() => {
    const visited = localStorage.getItem('hasVisited');
    setHasVisitedBefore(!!visited);
  }, []);

  useEffect(() => {
    if (!hasVisitedBefore) {
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 2000);

      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisited', 'true');
        setTimeout(() => setShowContent(true), 2000);
      }, 8000);

      return () => {
        clearInterval(messageInterval);
        clearTimeout(loadingTimeout);
      };
    } else {
      setIsLoading(false);
      setShowContent(true);
    }
  }, [hasVisitedBefore]);

  // إدارة التنبيه والتحويل التلقائي
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    if (showContent && hasVisitedBefore) {
      setShowRedirectAlert(true);
      redirectTimer = setTimeout(() => {
        setShowRedirectAlert(false);
        navigate('/case/members');
  
      }, 30000);
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [showContent, hasVisitedBefore]);

  const handleCloseAlert = () => {
    setShowRedirectAlert(false);
  };

  const features = [
    {
      title: "متابعة حالة كل قضية",
      description: "تتبع تطورات قضيتك في الوقت الفعلي"
    },
    {
      title: "دليل إرشادي ذكي",
      description: "إجابات فورية على استفساراتك القانونية"
    },
    {
      title: "ذكاء اصطناعي متقدم",
      description: "حلول ذكية للأسئلة القانونية المعقدة"
    }
  ];

  return (
    <div className="bg-gray-50 pt-10" dir="rtl">
      <AnimatePresence>
        {!hasVisitedBefore && isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center"
          >
            <div className="text-center space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMessage}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl text-black font-bold bg-white/90 px-6 py-3 rounded-lg shadow-md"
                >
                  {loadingMessages[currentMessage]}
                </motion.div>
              </AnimatePresence>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="inline-block"
              >
                <Scale className="w-12 h-12 text-white" />
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-1 bg-white/50 rounded-full mx-auto w-64"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="min-h-screen flex items-center bg-gradient-to-l from-white to-blue-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row items-center">
                  
                  <motion.div 
                    className="lg:w-1/2 px-6 lg:px-12 mb-12 lg:mb-0"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div 
                      className="inline-flex items-center px-4 py-2 rounded-full mb-6 
                      bg-gradient-to-br from-blue-50 to-white border border-blue-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-blue-800 font-semibold text-sm">
                        النيابة العامة المصرية
                      </span>
                    </motion.div>

                    <motion.h1 
                      className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                    الدليل الإرشادي لقضايا الاعضاء
                    </motion.h1>

                    <motion.p 
                      className="text-lg text-gray-700 mb-8 leading-relaxed"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      نظام متكامل لمتابعة القضايا وتسهيل الإجراءات القانونية. يوفر النظام أدوات ذكية تمكنك من متابعة حالة القضايا بسهولة، مع دليل إرشادي تفاعلي وخدمات متطورة لضمان سير العملية القانونية بكفاءة عالية.
                    </motion.p>

                    <div className="space-y-4 mb-10">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.2 }}
                        >
                          <div className="mt-1 mr-3 text-blue-600">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-gray-700 text-sm">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg
                      transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center">
                        ابدأ الآن
                        <ArrowLeft className="mr-2 w-4 h-4" />
                      </div>
                    </motion.button>
                  </motion.div>

                  <motion.div 
                    className="lg:w-1/2 px-6 lg:px-12 relative"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="relative">
                      <motion.div 
                        className="absolute -top-8 -right-8 bg-white p-4 rounded-full shadow-lg z-10"
                        whileHover={{ rotate: 5 }}
                      >
                        <div className="flex items-center">
                          <img 
                            src="/128px-Flag_of_Egypt.svg.png" 
                            alt="Egypt Flag" 
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                          />
                          <div className="mr-2 text-xs text-gray-700">
                            <div className="font-bold">النيابة العامة</div>
                            <div>جمهورية مصر العربية</div>
                          </div>
                        </div>
                      </motion.div>

                      <div className="relative">
                        <motion.img
                          src="./النائب العام مصر.png"
                          alt="Legal System"
                          className="rounded-xl border-8 border-white shadow-xl w-full max-w-lg mx-auto"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        />

                        <motion.div 
                          className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-lg"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Scale className="w-8 h-8 text-blue-600" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showRedirectAlert && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700">
                      سيتم تحويلك إلى نظام القضايا خلال 30 ثواني...
                    </span>
                    <button
                      onClick={handleCloseAlert}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      إغلاق
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.footer 
              className="bg-blue-50 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-700 text-sm">
                      جميع الحقوق محفوظة © {new Date().getFullYear()} النيابة العامة المصرية
                    </p>
                  </div>
                </div>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawSystem;