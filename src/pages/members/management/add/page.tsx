'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getDataUsers } from "@/api/authApi";
import axios from 'axios';
import toast from 'react-hot-toast';
import { read, utils } from 'xlsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react"; // استيراد أيقونة الإغلاق
import { useSearchParams } from 'react-router-dom';
import TypeCase from "@/components/defendants/typeCase";
import Cookies from "js-cookie";
import { useAuth } from "@/context/userContext";
import OffcierName from "@/components/members/officerName";
import ActionType from "@/components/members/actionType";
import GuideModalPopup from "@/components/members/guid_pdf_show";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


// Use the correct path to the PDF.js worker as a string
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
const PageAdd = () => {
    // بيانات القضية
    const [caseNumber, setCaseNumber] = useState('');
    const [year, setYear] = useState('');
    const [caseType, setCaseType] = useState('');
    const [investigationID, setInvestigationID] = useState('');
    const [accusedName, setAccusedName] = useState('');
    const { userData } = useAuth();
    const [searchParams] = useSearchParams();
    const token = Cookies.get('token');
    const member_number = userData?.member_id;
    const id = userData?.id;
    const prosecutionOfficeId = searchParams.get('type')
    const role = userData?.role;
    // الإجراءات
    const [defendantStatus, setDefendantStatus] = useState('');
    const [victimStatus, setVictimStatus] = useState('');
    const [witnessStatus, setWitnessStatus] = useState('');
    const [technicalReports, setTechnicalReports] = useState('');
    const [reportType, setReportType] = useState('');
    const [officerQuestion, setOfficerQuestion] = useState('');
    const [actionOther, setActionOther] = useState('');
    const [accusation, setAccusation] = useState('');

    const [oficer_name, setOfficerName] = useState('');
    const [action_type, setActionType] = useState('');
    const [usernameData, setUsernameData] = useState<[]>([]);
    const [username, setUsername] = useState('');


    const [importModalOpen, setImportModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showResults, setShowResults] = useState(false); // حالة لعرض النتائج



    const [showPdfButton, setShowPdfButton] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState('');
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const pdfFiles: { [key: string]: string } = {
        'الاتجار في البشر': '/pdfs/output_7.14.pdf',
        'اموال عامة': '/pdfs/output_16.41.pdf',
        'اهمال الطبي': '/pdfs/output_43.51.pdf',
        'تزوير': '/pdfs/output_53.65.pdf',
        'تهريب مهاجرين': '/pdfs/output_67.76.pdf',
        'القتل': '/pdfs/output_78.93.pdf',
    };
    useEffect(() => {
        const checkCharge = () => {
            const shouldShow = Object.keys(pdfFiles).includes(accusation);
            setShowPdfButton(shouldShow);
            if (!shouldShow) setIsPdfModalOpen(false);
        };

        checkCharge();
    }, [accusation]);

    const openPdfModal = () => {
        setSelectedPdf(pdfFiles[accusation]);
        console.log('Selected PDF:', pdfFiles[accusation]);
        setIsModalOpen(true);
        setIsPdfModalOpen(true);
    };

    // const closePdfModal = () => {
    //     setIsPdfModalOpen(false);
    //     setPageNumber(1);
    // };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            const req = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/add`, {
                caseNumber,
                year,
                officerQuestion,
                caseType,
                investigationID,
                accusedName,
                accusation,
                memberNumber: member_number,
                defendantQuestion: defendantStatus,
                victimQuestion: victimStatus,
                witnessQuestion: witnessStatus,
                actionOther,
                actionType: action_type,
                officerName: oficer_name,
                technicalReports,
                ...(technicalReports === 'حتى الآن' && { reportType }),
                userID: id,
                username,
                prosecutionOfficeId
            }, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            }
            );

            // Clear form
            setCaseNumber('');
            setYear('');
            setCaseType('');
            setInvestigationID('');
            setAccusedName('');
            setDefendantStatus('');
            setVictimStatus('');
            setWitnessStatus('');
            setTechnicalReports('');
            setReportType('');
            setOfficerQuestion('');
            setActionOther('');

            if (req.data.success) {
                toast.success('تم إضافة القضية بنجاح');
            } else {
                toast.error('فشلت عملية إضافة القضية');
            }
        } catch (error) {
            if (error instanceof Error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else {
                    toast.error('An unknown error occurred');
                }
            } else {
                console.error('An unknown error occurred');
            }
        }
    };



    const handleFileUpload = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = utils.sheet_to_json(worksheet);

                // تحويل البيانات مع التحقق من الحقول المطلوبة
                const cases = jsonData.map((item: any) => {
                    // التحقق من الحقول الأساسية
                    if (!item['رقم القضية'] || !item['اسم المتهم'] || !item['رقم العضو']) {
                        throw new Error('بيانات ناقصة في أحد الصفوف');
                    }

                    return {
                        caseNumber: item['رقم القضية'],
                        year: item['السنة'],
                        investigationID: item['رقم حصر التحقيق'],
                        accusedName: item['اسم المتهم'],
                        accusation: item['التهمة'],
                        memberNumber: item['رقم العضو'],
                        caseType: item['نوع القضية'],
                        defendantQuestion: item['سؤال المتهم'],
                        victimQuestion: item['سؤال المجني عليه'],
                        witnessQuestion: item['سؤال الشهود'],
                        officerQuestion: item['سؤال الضابط'],
                        officerName: item['اسم الضابط'],
                        technicalReports: item['التقارير الفنية'],
                        reportType: item['نوع التقرير'],
                        actionOther: item['إجراءات أخرى'],
                        actionType: item['نوع الاجراءات'],
                        userID: id,
                        username,
                        prosecutionOfficeId

                    };
                });

                setIsProcessing(true);
                let success = 0;
                let errors = 0;

                for (let i = 0; i < cases.length; i++) {
                    try {
                        await axios.post(
                            `${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/add`,
                            cases[i],
                            {
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : '',
                                }
                            }
                        );
                        success++;
                    } catch (error) {
                        errors++;
                        if (axios.isAxiosError(error)) {
                            console.error(`خطأ في الصف ${i + 1}:`, error.response?.data || error.message);
                        } else {
                            console.error(`خطأ في الصف ${i + 1}:`, error);
                        }
                    }

                    setUploadProgress((i + 1) / cases.length * 100);
                    setSuccessCount(success);
                    setErrorCount(errors);

                    await new Promise(resolve => setTimeout(resolve, 100)); // تقليل التأخير
                }

                setIsProcessing(false);
                setShowResults(true);
                setSelectedFile(null);
                toast.success(`تم استيراد ${success} قضية بنجاح مع ${errors} أخطاء`);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message || 'حدث خطأ في معالجة الملف');
                } else {
                    toast.error('حدث خطأ في معالجة الملف');
                }
                setIsProcessing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDataUsers(role as string);
                setUsernameData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            {showPdfButton && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <Button
                        onClick={openPdfModal}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-full px-6 py-3 flex items-center gap-2"
                    >
                        <span>عرض الدليل الإرشادي</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.65 4.5 1.734V4.804zm1 0v10.93C11.782 14.65 13.331 14 14.5 14c1.255 0 2.443.29 3.5.804V4.804A7.969 7.969 0 0014.5 4c-1.669 0-3.218.65-4.5 1.734zM14.5 3c-1.287 0-2.49.252-3.5.707V2h-2v1.707A7.967 7.967 0 005.5 3C4.58 3 3.704 3.181 2.9 3.5h.222c.061 0 .122.006.182.017C4.12 3.164 5.091 3.43 6 3.707v12.586c-.909.277-1.88.543-2.696.69-.06.011-.121.017-.182.017H2.9c.804.319 1.68.5 2.6.5 1.287 0 2.49-.252 3.5-.707V18h2v-1.707a7.967 7.967 0 003.5.707c.92 0 1.796-.181 2.6-.5h-.222c-.061 0-.122-.006-.182-.017-.816-.147-1.787-.413-2.696-.69V3.707c.909-.277 1.88-.543 2.696-.69.06-.011.121-.017.182-.017h.222c-.804-.319-1.68-.5-2.6-.5z" />
                        </svg>
                    </Button>
                </motion.div>
            )}
            <AnimatePresence>
                {isPdfModalOpen && (
                    <GuideModalPopup
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        selectedPdf={selectedPdf}
                    />
                    // <motion.div
                    //     initial={{ opacity: 0 }}
                    //     animate={{ opacity: 1 }}
                    //     exit={{ opacity: 0 }}
                    //     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    // >
                    //     <motion.div
                    //         initial={{ scale: 0.8 }}
                    //         animate={{ scale: 1 }}
                    //         className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative"
                    //     >
                    //         <button
                    //             onClick={closePdfModal}
                    //             className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                    //         >
                    //             <X className="h-6 w-6" />
                    //         </button>

                            // <div className="flex flex-col items-center gap-4 h-[80vh]">
                            //     <Document
                            //         file={selectedPdf}
                            //         onLoadError={(error) => console.error('Failed to load PDF:', error)}

                            //         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            //         className="flex-1 overflow-auto"
                            //     >
                            //         <Page
                            //             pageNumber={pageNumber}
                            //             width={800}
                            //             renderAnnotationLayer={false}
                            //         />
                            //     </Document>

                            //     <div className="flex items-center gap-4 mt-4">
                            //         <Button
                            //             onClick={() => handlePageChange(pageNumber - 1)}
                            //             disabled={pageNumber <= 1}
                            //             variant="outline"
                            //         >
                            //             السابق
                            //         </Button>

                            //         <span className="text-gray-600">
                            //             الصفحة {pageNumber} من {numPages}
                            //         </span>

                            //         <Button
                            //             onClick={() => handlePageChange(pageNumber + 1)}
                            //             disabled={pageNumber >= numPages}
                            //             variant="outline"
                            //         >
                            //             التالي
                            //         </Button>
                            //     </div>
                            // </div>
                    //     </motion.div>
                    // </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="  h-[70px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إضافة قضية جديدة
                    </h1>
                    <Button
                        onClick={() => setImportModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        استيراد من Excel
                    </Button>
                </div>
                <AnimatePresence>
                    {(importModalOpen || showResults) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 w-full max-w-2xl relative"
                            >
                                <button
                                    onClick={() => {
                                        setImportModalOpen(false);
                                        setShowResults(false);
                                        setUploadProgress(0);
                                        setSuccessCount(0);
                                        setErrorCount(0);
                                    }}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                {!isProcessing && !showResults ? (
                                    <div className="space-y-6">
                                        <Input
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="flex justify-end gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setImportModalOpen(false)}
                                            >
                                                إلغاء
                                            </Button>
                                            <Button
                                                disabled={!selectedFile}
                                                onClick={() => selectedFile && handleFileUpload(selectedFile)}
                                            >
                                                بدء الاستيراد
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-center">
                                        {isProcessing ? (
                                            <>
                                                <Progress value={uploadProgress} className="h-3" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-green-600">الناجحة: {successCount}</div>
                                                    <div className="text-red-600">خطأ: {errorCount}</div>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => setIsProcessing(false)}
                                                >
                                                    إيقاف الاستيراد
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-semibold text-gray-800">نتيجة الاستيراد</h3>
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div className="bg-green-100 p-4 rounded-lg">
                                                        <span className="text-green-700 font-bold">{successCount}</span>
                                                        <p className="text-sm">استيراد ناجح</p>
                                                    </div>
                                                    <div className="bg-red-100 p-4 rounded-lg">
                                                        <span className="text-red-700 font-bold">{errorCount}</span>
                                                        <p className="text-sm">خطأ</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        setShowResults(false);
                                                        setImportModalOpen(false);
                                                    }}
                                                    className="mt-4"
                                                >
                                                    إغلاق
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* بيانات القضية */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                بيانات القضية
                            </legend>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">

                                {/* رقم القضية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم القضية</label>
                                    <Input
                                        type="text"
                                        value={caseNumber}
                                        onChange={(e) => setCaseNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* السنة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">السنة</label>
                                    <Select value={year} onValueChange={setYear}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="السنة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2023">2023</SelectItem>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {
                                    actionOther === 'حتى الآن' && (
                                        <div className="space-y-2">
                                            <TypeCase value={caseType} onValueChange={setCaseType} />
                                        </div>
                                    )
                                }

                                {/* رقم حصر التحقيق */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم حصر التحقيق</label>
                                    <Input
                                        type="text"
                                        value={investigationID}
                                        onChange={(e) => setInvestigationID(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700"> التهمة </label>
                                    <Select
                                        value={accusation}
                                        onValueChange={setAccusation}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر التهمة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="الاتجار في البشر">الاتجار في البشر</SelectItem>
                                            <SelectItem value="اموال عامة">اموال عامة</SelectItem>
                                            <SelectItem value="اهمال الطبي">اهمال الطبي</SelectItem>
                                            <SelectItem value="تزوير">تزوير</SelectItem>
                                            <SelectItem value="تهريب مهاجرين">تهريب مهاجرين</SelectItem>
                                            <SelectItem value="القتل">القتل</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* اسم المتهم */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">اسم المتهم</label>
                                    <Input
                                        type="text"
                                        value={accusedName}
                                        onChange={(e) => setAccusedName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* رقم العضو */}
                                {/*الاعضاء*/}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">الاعضاء</label>
                                    <Select onValueChange={(value) => setUsername(value)}>
                                        <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="الاعضاء" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                usernameData.map((user) => (
                                                    <SelectItem key={user} value={user}>
                                                        {user}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        </fieldset>

                        {/* الإجراءات */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                الإجراءات
                            </legend>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                                {/* سؤال المتهم */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال المتهم</label>
                                    <Select
                                        value={defendantStatus}
                                        onValueChange={setDefendantStatus}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                            <SelectItem value="تم">تم</SelectItem>
                                            <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* سؤال المجني عليه */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال المجني عليه</label>
                                    <Select
                                        value={victimStatus}
                                        onValueChange={setVictimStatus}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                            <SelectItem value="تم">تم</SelectItem>
                                            <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* سؤال الشهود */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال الشهود</label>
                                    <Select
                                        value={witnessStatus}
                                        onValueChange={setWitnessStatus}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                            <SelectItem value="تم">تم</SelectItem>
                                            <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال الظابط </label>
                                    <Select
                                        value={officerQuestion}
                                        onValueChange={setOfficerQuestion}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                            <SelectItem value="تم">تم</SelectItem>
                                            <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {
                                    officerQuestion === 'حتى الآن' && (
                                        <div className="space-y-2">
                                            <OffcierName value={oficer_name} onValueChange={setOfficerName} officerQuestion={officerQuestion} />
                                        </div>
                                    )
                                }
                                {/* تقارير فنية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">تقارير فنية</label>
                                    <Select
                                        value={technicalReports}
                                        onValueChange={setTechnicalReports}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="تم">تم</SelectItem>
                                            <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                            <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* نوع التقرير (يظهر فقط إذا كانت التقارير الفنية "حتى الآن") */}
                                {technicalReports === 'حتى الآن' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">نوع التقرير</label>

                                        <Input
                                            type="text"
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                            required={technicalReports === 'حتى الآن'}
                                        />

                                    </div>
                                )}


                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">اجراءات اخرى</label>
                                    <Select
                                        value={actionOther}
                                        onValueChange={setActionOther}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="تم">تم</SelectItem>
                                            <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                            <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {
                                    actionOther === 'حتى الآن' && (
                                        <div className="space-y-2">
                                            <ActionType value={action_type} onValueChange={setActionType} actionOther={actionOther} />
                                        </div>
                                    )

                                }

                            </div>
                        </fieldset>

                        {/* زر الإرسال */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg"
                            >
                                إضافة القضية
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PageAdd;