'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { read, utils } from 'xlsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react"; // استيراد أيقونة الإغلاق

import Cookies from "js-cookie";
import { useAuth } from "@/context/userContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Page = () => {
    // بيانات القضية
    const [caseNumber, setCaseNumber] = useState('');
    const [year, setYear] = useState(0);
    const [caseType, setCaseType] = useState('');
    const [investigationID, setInvestigationID] = useState('');
    const [accusedName, setAccusedName] = useState('');
    const { userData } = useAuth();
    const member_number = userData?.member_id;
    const id = userData?.id;

    // الإجراءات
    const [defendantStatus, setDefendantStatus] = useState('');
    const [victimStatus, setVictimStatus] = useState('');
    const [witnessStatus, setWitnessStatus] = useState('');
    const [technicalReports, setTechnicalReports] = useState('');
    const [reportType, setReportType] = useState('');
    const [readyForAction, setReadyForAction] = useState('');
    const [officerQuestion, setOfficerQuestion] = useState('');
    const [actionOther, setActionOther] = useState('');
    const [accusation, setAccusation] = useState('');


    const [importModalOpen, setImportModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showResults, setShowResults] = useState(false); // حالة لعرض النتائج
    

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
                technicalReports,
                ...(technicalReports === 'حتى الآن' && { reportType }),
                readyForAction,
                userId: id
            });

            // Clear form
            setCaseNumber('');
            setYear(0);
            setCaseType('');
            setInvestigationID('');
            setAccusedName('');
            setDefendantStatus('');
            setVictimStatus('');
            setWitnessStatus('');
            setTechnicalReports('');
            setReportType('');
            setReadyForAction('');

            if (req.data.success) {
                toast.success('تم إضافة القضية بنجاح');
            } else {
                toast.error('فشلت عملية إضافة القضية');
            }
        } catch (error) {
            toast.error('فشلت عملية إضافة القضية');
            console.error(error);
        }
    };

    const convertArabicDate = (dateString: string) => {
        const arabicToLatinMap: { [key: string]: string } = {
            '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
        };

        const normalizedDate = dateString
            .split('')
            .map(char => arabicToLatinMap[char] || char)
            .join('')
            .replace(/[^0-9/]/g, '') // إزالة الأحرف غير الرقمية
            .replace(/\s/g, ''); // إزالة المسافات

        const parts = normalizedDate.split('/');

        if (parts.length !== 3 || parts.some(p => isNaN(parseInt(p)))) {
            throw new Error('صيغة التاريخ غير صالحة');
        }

        const [day, month, year] = parts;
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        if (isNaN(new Date(formattedDate).getTime())) {
            throw new Error('تاريخ غير صالح');
        }

        return formattedDate;
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
                        defendantQuestion: item['سؤال المتهم'],
                        victimQuestion: item['سؤال المجني عليه'],
                        witnessQuestion: item['سؤال الشهود'],
                        officerQuestion: item['سؤال الضابط'],
                        technicalReports: item['التقارير الفنية'],
                        reportType: item['نوع التقرير'],
                        actionOther: item['إجراءات أخرى'],
                        userId: id
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
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
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

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="  h-[70px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إضافة قضية جديدة
                    </h1>
                    <Button
                        onClick={() => setImportModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
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
                                    <Input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        required
                                    />
                                </div>

                                {/* نوع القضية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">نوع القضية</label>
                                    <Select
                                        value={caseType}
                                        onValueChange={setCaseType}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر النوع" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="جنحة">جنحة</SelectItem>
                                            <SelectItem value="جناية">جناية</SelectItem>
                                            <SelectItem value="إداري">إداري</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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
                                    <Input
                                        type="text"
                                        value={accusation}
                                        onChange={(e) => setAccusation(e.target.value)}
                                        required
                                    />
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
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم العضو</label>
                                    <Input
                                        type="text"
                                        value={member_number || ''}
                                        disabled
                                    />
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




                                {/* جاهزة للتصرف */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">جاهزة للتصرف</label>
                                    <Select
                                        value={readyForAction}
                                        onValueChange={setReadyForAction}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="نعم">نعم</SelectItem>
                                            <SelectItem value="لا">لا</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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

export default Page;