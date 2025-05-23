import { JSX, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';
import { LockKeyhole, LockKeyholeOpen , X } from 'lucide-react';
import { Document, Page } from 'react-pdf';
import { debounce } from 'lodash';

interface PDFItem {
  pathname: string;
  path: string;
  image: string;
}

interface PDFMap {
  [key: string]: PDFItem[];
}

interface GuideModalPopupProps {
  accusation: string;
  isOpen: boolean;
  onClose: () => void;
  selectedPdf: PDFMap;
  setSelectedPdf: (accusation: string) => void;
}

const GuideModalPopup = ({
  isOpen,
  onClose,
  selectedPdf,
  accusation,
}: GuideModalPopupProps) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [contact, setContact] = useState<PDFItem[]>([]);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [itIsLocked, setItIsLocked] = useState(false);


  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastChangeRef = useRef<number>(0);

  useEffect(() => {
    if (selectedPdf && accusation) {
      const items = selectedPdf[accusation] || [];
      setContact(items);
      setSelectedCard(null);
      setPageNumber(1);
      setNumPages(0);
      setFilePath(null);
    }
  }, [accusation, selectedPdf]);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, numPages));
    if (validPage === pageNumber) return;
    setPageNumber(validPage);
    lastChangeRef.current = Date.now();
  };

  const onScroll = debounce(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (Date.now() - lastChangeRef.current < 300) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      handlePageChange(pageNumber + 1);
    }
  }, 200);

  const onWheel = (e: WheelEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (Date.now() - lastChangeRef.current < 300) return;
    if (e.deltaY < 0) {
      handlePageChange(pageNumber - 1);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', onScroll);
    el.addEventListener('wheel', onWheel);
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
      onScroll.cancel();
    };
  }, [pageNumber, numPages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    // في حال تم إزالة المكون فجأة (أمان)
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
          onClick={onClose}
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex justify-center items-center rounded-xl w-full h-screen max-w-7xl relative "
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              backgroundImage: `url('/background.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex flex-col p-8 gap-8 w-full h-full">
              {!selectedCard ? (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {contact.map((item) => (
                      <motion.div
                        key={item.pathname}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => {
                          setSelectedCard(item.pathname);
                          setFilePath(item.path);
                          setPageNumber(1);
                          lastChangeRef.current = Date.now();
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={item.image}
                          alt={item.pathname}
                          className="w-[200px] h-[200px] mb-4 rounded-lg shadow-lg"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  key="details"
                  className="w-full h-full flex flex-col"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="text-white hover:text-gray-200"
                    >
                      العودة للقائمة
                    </button>
                    <div
                      onClick={() => setItIsLocked(!itIsLocked)}
                      className="bg-white fixed left-16 top-4 z-50 rounded-xl flex items-center px-4 py-2 gap-2 cursor-pointer shadow-lg"
                    >
                    <X onClick={onClose}/>    

                    </div>
                  </div>

                    <div className="bg-gray-100 flex-1 rounded-lg relative h-full  ">
                    {/* حاوية التمرير الوحيدة والمربوطة بالحالة */}
                    <div
                      ref={scrollContainerRef}
                      className={`w-full h-full flex justify-center ${itIsLocked ? 'overflow-hidden' : 'overflow-auto'} `}
                      >
                      {filePath && (
                        <Document
                          file={filePath}
                          onLoadError={(error) =>
                            console.error('فشل في تحميل PDF:', error)
                          }
                          onLoadSuccess={({ numPages }) =>
                            setNumPages(numPages)
                          }
                        >
                          <Page
                            className="w-full flex justify-center items-center h-[100vh]"
                            pageNumber={pageNumber}
                            width={window.innerWidth * 0.8}
                            renderAnnotationLayer={false}
                            scale={0.8}
                          />
                        </Document>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-3 py-1 rounded-full z-10">
                      الصفحة {pageNumber} من {numPages}
                    </div>
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
