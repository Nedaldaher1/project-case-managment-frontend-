import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, pdf, Font, Image } from '@react-pdf/renderer';
import { motion, AnimatePresence } from 'framer-motion';

// تسجيل الخط العربي
Font.register({
    family: 'ArabicFont',
    src: '/fonts/Rubik-Italic.ttf',
});

// أنماط وثيقة PDF
const pdfStyles = StyleSheet.create({
    page: {
        padding: 10,
        fontFamily: 'ArabicFont',
        direction: 'rtl',
        textAlign: 'right',
        lineHeight: 1.8,
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    contentWrapper: {
        backgroundColor: '#f5f8f9',
        borderRadius: 8,
        marginBottom: 20,
        padding: 10,
    },
    headerSection: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 15,
        width: '100%',
    },
    ContainerItems: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right',
    },
    sideInfo: {
        textAlign: 'right',
    },
    lawSection: {
        marginBottom: 25,
    },
    lawSectionContainer: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 15,
    },
    twoSectionContainer: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 15,
    },
    footer: {
        marginTop: 30,
        textAlign: 'right',
        fontSize: 12,
        color: '#777',
    },
    footerSectionContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        lineHeight: 0.8,
        paddingTop: 15,
    },
    footerText: {
        fontSize: 14,
        color: '#777',
        textAlign: 'right',
        marginBottom: 5,
    },
    lawTitle: {
        fontSize: 14,
        fontWeight: 'semibold',
        marginBottom: 12,
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
    subTitle: {
        fontSize: 13,
        marginBottom: 8,
        textAlign: 'right',
        color: '#353c4a',
    },
    bold: {
        fontWeight: '700',
        color: '#000',
    },
    lawText: {
        fontSize: 12,
        lineHeight: 2,
        maxWidth: '450px',
        textAlign: 'right',
        color: '#353c4a',
    },
    signatureSection: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        marginTop: 50,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#000',
    },
    signatureBlock: {
        width: '40%',
        textAlign: 'right',
    },
    stamp: {
        fontSize: 12,
        color: '#777',
        marginTop: 15,
        textAlign: 'right',
    },
});

interface OfficialDocumentProps {
    accusedName: string;
    caseNumber: string;
    prosecutorName: string;
}

const OfficialDocument = ({ accusedName, caseNumber, prosecutorName }: OfficialDocumentProps) => {
    const getFormattedDate = (): string => {
        const now = new Date();
        return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    };
    const getSelectedProsecution = () => {
        const prosecutionName = localStorage.getItem('selectedProsecution');
        return prosecutionName ? decodeURIComponent(prosecutionName) : null;
    };
    const nameOfProsecution = getSelectedProsecution() || 'النيابة العامة';
    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.contentWrapper}>
                    <View style={pdfStyles.headerSection}>
                        <View style={pdfStyles.ContainerItems}>
                            <View style={{ flex: 1, textAlign: 'right' }}>
                                <Text style={pdfStyles.mainTitle}>النائبة العامة</Text>
                                <Text style={pdfStyles.mainTitle}>{nameOfProsecution}</Text>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>
                                    القضية رقم  {caseNumber} /2025 /مخلفات/{nameOfProsecution}
                                </Text>
                            </View>
                            <View style={pdfStyles.sideInfo}>
                                <Image
                                    src="/logo void.png"
                                    style={{ width: 50, height: 50, marginBottom: 10 }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={pdfStyles.lawSection}>
                        <View style={pdfStyles.lawSectionContainer}>
                            <Text style={pdfStyles.lawTitle}>في يوم {getFormattedDate()}</Text>
                            <Text style={pdfStyles.subTitle}>
                                <Text style={pdfStyles.bold}>نحن</Text> / وكيل النائب العام {prosecutorName} 
                            </Text>
                            <Text style={pdfStyles.lawText}>
                                أولاً: تنفيذ الأوراق جنحة ومخالفة بالمادة 341 من قانون العقوبات، والمواد
                                أرقام 13، 15، 1، 2، 7/ من القانون 66 لسنة 1973 المعدل بالقانون 121
                                لسنة 2008، 100 لسنة 1999، 121 لسنة 1980، 120 لسنة 1980، والمادة 341 من
                                اللائحة التنفيذية لقانون المرور/الأخير
                            </Text>
                        </View>
                    </View>

                    <View style={pdfStyles.lawSection}>
                        <View style={pdfStyles.twoSectionContainer}>
                            <Text style={pdfStyles.subTitle}>ضد</Text>
                            <Text style={pdfStyles.subTitle}>
                                <Text style={pdfStyles.bold}>{accusedName}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={pdfStyles.lawSection}>
                        <View style={pdfStyles.lawSectionContainer}>
                            <Text style={pdfStyles.lawTitle}>{nameOfProsecution} لانه في بدائرة</Text>
                            <Text style={pdfStyles.lawText}>
                                1.قام بتبديد اللوحات المعدنية للسيارة الخاصة ملكه
                            </Text>
                            <Text style={pdfStyles.lawText}>
                                2.لم يرد اللوحة المعدنية بعد أنتهاء الترخيص في الميعاد
                            </Text>
                        </View>
                    </View>

                    <View style={pdfStyles.lawSection}>
                        <View style={pdfStyles.lawSectionContainer}>
                            <Text style={pdfStyles.lawText}>ثانيا : تأمر</Text>
                            <Text style={{ fontSize: 10, lineHeight: 2, textAlign: 'right' }}>
                                بتغريم المتهم {accusedName} حسن 25  خمسة وعشرون جنيه فقط لاغير والمصاريف يعلن المتهم
                            </Text>
                        </View>
                    </View>

                    <View style={pdfStyles.footer}>
                        <View style={pdfStyles.footerSectionContainer}>
                            <Text style={pdfStyles.lawText}>وكيل النائب العام</Text>
                            <Text style={{ fontSize: 10, lineHeight: 2, textAlign: 'right' }}>
                                {prosecutorName}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const FloatingPDFExport = ({ accusedName, caseNumber, }: OfficialDocumentProps) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isFontReady, setIsFontReady] = useState(false);
    const [prosecutorName, setProsecutorName] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem('prosecutorName') || '';
        setProsecutorName(savedName);

        Font.load({ fontFamily: 'ArabicFont' }).then(() => setIsFontReady(true));
    }, []);

    const handleSaveName = () => {
        localStorage.setItem('prosecutorName', prosecutorName);
        setIsEditModalOpen(false);
    };

    const handleDownloadPDF = async () => {
        try {
            const blob = await pdf(
                <OfficialDocument
                    accusedName={accusedName}
                    caseNumber={caseNumber}
                    prosecutorName={prosecutorName}
                />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('خطأ في إنشاء الملف:', error);
            alert('حدث خطأ أثناء التصدير!');
        }
    };

    return (
        <div className="fixed bottom-32 right-8 z-50">
            <div className="flex gap-4">


                <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                >
                    معاينة الوثيقة
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
            </div>

            {/* نافذة تعديل التوقيع */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  z-[100]"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        <motion.div
                            className="bg-white rounded-xl w-full max-w-md p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4 text-right">تعديل اسم النائب العام</h2>
                            <input
                                type="text"
                                value={prosecutorName}
                                onChange={(e) => setProsecutorName(e.target.value)}
                                className="w-full p-2 border rounded mb-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="اسم النائب العام"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSaveName}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    حفظ
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* نافذة معاينة PDF */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        onClick={() => setIsPreviewOpen(false)}
                    >
                        <motion.div
                            className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                            <div className='flex gap-2'>
                            <h2 className="text-2xl font-bold text-blue-600">معاينة الوثيقة</h2>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="bg-green-600  text-white p-2  rounded-md shadow-2xl hover:bg-green-700 transition-all duration-300 hover:scale-110"
                                >
                                    تعديل اسم النائب
                                </button>
                            </div>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 text-3xl"
                                >
                                    &times;
                                </button>
                            </div>

                            {isFontReady ? (
                                <div className="flex-1 overflow-hidden">
                                    <PDFViewer width="100%" height="100%">
                                        <OfficialDocument
                                            accusedName={accusedName}
                                            caseNumber={caseNumber}
                                            prosecutorName={prosecutorName}
                                        />
                                    </PDFViewer>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-gray-500 animate-pulse">جاري تحميل الخطوط...</p>
                                </div>
                            )}

                            <div className="p-4 border-t flex justify-end gap-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    تحميل PDF
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingPDFExport;