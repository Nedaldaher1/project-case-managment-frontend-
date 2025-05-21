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
  image: string
}

interface GuideModalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPdf: string;
}

const GuideModalPopup = ({ isOpen, onClose, selectedPdf }: GuideModalPopupProps) => {
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
      image: "/icons_member/Picture6.png"

    },
    {
      type: 'resources',
      title: 'تطبيقات احكام محكمة النقض',
      description: 'لمعرفة تطبقات احكام محكمة النقض',
      icon: <BookOpen className="h-16 w-16" />,
      color: 'from-green-500 to-green-600',
      image: "/icons_member/Picture2.png"

    },
    {
      type: 'faq',
      title: 'الارشادات الواجب اتخاذها',
      description: 'الارشادات والتدابير التي يجب اخدها في الاعتبار',
      icon: <CircleHelp className="h-16 w-16" />,
      color: 'from-purple-500 to-purple-600',
      image: "/icons_member/Picture4.png"

    },
    {
      type: 'contact',
      title: 'المآخذ الشائعة',
      description: 'تعرف على الأمور الأكثر شيوعًا',
      icon: <Mail className="h-16 w-16" />,
      color: 'from-orange-500 to-orange-600',
      image: "/icons_member/Picture1.png"
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
            className=" flex  justify-center items-center rounded-xl w-full h-[700px] max-w-7xl overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{backgroundImage: `url('/background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}
          >
            {/* المحتوى */}
            <div className="flex flex-col p-16 gap-32">
              {!selectedCard ? (
                <>


                  <div className="grid grid-rows-2 grid-cols-2 gap-6 justify-center">
                    {cardsData.map((card) => (
                      <img onClick={() => setSelectedCard(card.type)} key={card.type} src={card.image} alt="icon" className="w-[200px] h-[200px] mb-4" />
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
