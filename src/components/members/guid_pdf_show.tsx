import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CircleHelp, BookOpen, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Document, Page } from 'react-pdf';
interface CardData {
  type: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface GuideModalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPdf: string;
}

const GuideModalPopup = ({ isOpen, onClose,selectedPdf }: GuideModalPopupProps) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPdfButton, setShowPdfButton] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardsData: CardData[] = [
    {
      type: 'services',
      title: 'الشرح',
      description: 'هنا لشرح النص التشريعي',
      icon: <Info className="h-16 w-16" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: 'resources',
      title: 'تطبيقات احكام محكمة النقض',
      description: 'لمعرفة تطبقات احكام محكمة النقض',
      icon: <BookOpen className="h-16 w-16" />,
      color: 'from-green-500 to-green-600',
    },
    {
      type: 'faq',
      title: 'الارشادات الواجب اتخاذها',
      description: 'الارشادات والتدابير التي يجب اخدها في الاعتبار',
      icon: <CircleHelp className="h-16 w-16" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      type: 'contact',
      title: 'المآخذ الشائعة',
      description: 'تعرف على الأمور الأكثر شيوعًا',
      icon: <Mail className="h-16 w-16" />,
      color: 'from-orange-500 to-orange-600',
    },
  ];
  const handlePageChange = (newPage: number) => {
    setPageNumber(Math.max(1, Math.min(newPage, numPages)));
};
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white flex  justify-center items-center rounded-xl w-full h-[100vh] max-w-7xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* المحتوى */}
            <div className="flex flex-col p-16 gap-32">
              {!selectedCard ? (
                <>
                  <h2 className="text-5xl font-bold text-gray-800 mb-8 text-center">
                    الدليل الإرشادي
                  </h2>

                  <div className="flex flex-row flex-wrap gap-6 justify-center">
                    {cardsData.map((card) => (
                      <div
                        key={card.type}
                        className={`${card.color} flex flex-col items-center justify-start w-[250px] h-[250px] text-center text-white rounded-lg p-6 cursor-pointer transition-transform duration-300 hover:scale-105 bg-gradient-to-br`}
                        onClick={() => setSelectedCard(card.type)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="mb-4">{card.icon}</div>
                          <h3 className="text-lg font-bold">{card.title}</h3>
                          <p className="text-sm opacity-90 mt-2">{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  key="details"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="mb-6 text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-arrow-right ml-2" />
                    العودة للقائمة
                  </button>

                  <h3 className="text-xl font-bold mb-4">
                    {cardsData.find((c) => c.type === selectedCard)?.title}
                  </h3>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700">
                    <div className="flex flex-col items-center gap-4 h-[70vh]">
                                <Document
                                    file={selectedPdf}
                                    onLoadError={(error) => console.error('Failed to load PDF:', error)}

                                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                    className="flex-1 overflow-auto"
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        width={800}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>

                                <div className="flex items-center gap-4 mt-4">
                                    <Button
                                        onClick={() => handlePageChange(pageNumber - 1)}
                                        disabled={pageNumber <= 1}
                                        variant="outline"
                                    >
                                        السابق
                                    </Button>

                                    <span className="text-gray-600">
                                        الصفحة {pageNumber} من {numPages}
                                    </span>

                                    <Button
                                        onClick={() => handlePageChange(pageNumber + 1)}
                                        disabled={pageNumber >= numPages}
                                        variant="outline"
                                    >
                                        التالي
                                    </Button>
                                </div>
                            </div>
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuideModalPopup;
