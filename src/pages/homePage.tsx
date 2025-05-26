import { FC, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft, Scale, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LawSystem: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);
  const navigate = useNavigate();
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadingMessages = [
    "جاري إعداد النظام القضائي...",
    "نقوم بتحميل الأدلة الإرشادية...",
    "تهيئة الذكاء الاصطناعي...",
    "كل شيء جاهز!",
  ];

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



  const handleCloseAlert = () => {
    setShowRedirectAlert(false);
  };

  const toggleVideoExpansion = () => {
    setIsVideoExpanded(!isVideoExpanded);
    document.body.style.overflow = isVideoExpanded ? 'auto' : 'hidden';
    if (videoRef.current) {
      if (isVideoExpanded) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const features = [
    {
      title: "عرض شامل ومُفصّل لأركان الجريمة.",
      description: "تتبع تطورات قضيتك في الوقت الفعلي"
    },
    {
      title: "أحكام محكمة النقض ذات الصلة.",
      description: "إجابات فورية على استفساراتك القانونية"
    },
    {
      title: "الأسئلة الاسترشادية والنقاط القانونية الواجب استيفاؤها.",
      description: "حلول ذكية للأسئلة القانونية المعقدة"
    },
    {
      title: "رصد لأبرز المآخذ الشائعة لتفاديها خلال التحقيق.",
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
                      بناء علي توجهات معالي النائب العام بضرورة الارتقاء بالمستوى الفني لأعضاء النيابة العامة، تم إعداد مقترح نيابة جنوب المنصورة الكلية بإضافة برنامج "الدليل الإرشادي" لمنظومة العدالة الجنائية كأداة تدريبية وتطبيقية متكاملة، تهدف إلى تمكين أعضاء النيابة من الإحاطة الدقيقة بكافة الجوانب القانونية والعملية للجرائم المختلفة. ويجدر الإشارة إلى أن هذا البرنامج يتميز بكونه نظاماً ذكياً يتفاعل تلقائياً مع عضو النيابة العامة بمجرد البحث عن نوع الجريمة محل التحقيق ليتمكن من الولوج إلى محتوى متخصص ينقسم إلى أربعة محاور رئيسية:
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
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg
                      transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/case/members')}
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
                        <div  onClick={toggleVideoExpansion} className="flex items-center">
                          <img
                            src="/128px-Flag_of_Egypt.svg.png"
                            alt="Egypt Flag"
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                          />
                          <div className="mr-2 text-xs text-gray-700">
                          <p className=' font-bold text-xl' >
                          مقطع مرئي لشرح آلية عمل المنظومة 
                          </p>
                          </div>
                        </div>
                      </motion.div>

                      <div className="relative">
                        <motion.div
                          className="rounded-xl border-8 border-white shadow-xl w-full max-w-lg mx-auto overflow-hidden cursor-pointer"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          onClick={toggleVideoExpansion}
                        >
                          <video
                            ref={videoRef}
                            className="w-full h-auto"
                            poster="/النائب العام مصر.png"
                            muted
                          >
                            <source src="/1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>

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
              {isVideoExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
                  onClick={toggleVideoExpansion}
                >
                  <motion.div
                    className="relative w-full max-w-4xl mx-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={toggleVideoExpansion}
                      className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
                    >
                      <X className="w-10 h-10" />
                    </button>
                    <video
                      ref={videoRef}
                      className="w-full h-full rounded-lg shadow-2xl"
                      controls
                      autoPlay
                    >
                      <source src="/1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </motion.div>
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