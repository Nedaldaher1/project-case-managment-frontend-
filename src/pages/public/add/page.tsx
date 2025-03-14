import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Progress } from "@/components/ui/progress";
import { read, utils } from 'xlsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/context/userContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from "lucide-react"; // استيراد أيقونة الإغلاق

const Page = () => {
    const [caseNumber, setCaseNumber] = useState('');
    const [caseDate, setCaseDate] = useState('');
    const [casePrisonDate, setCasePrisonDate] = useState('');
    const [caseRenewalDate, setCaseRenewalDate] = useState('');
    const [issuingDepartment, setIssuingDepartment] = useState('');
    const [caseType, setCaseType] = useState('');
    const [officeNumber, setOfficeNumber] = useState('');
    const [year, setYear] = useState('');
    const [investigationID, setInvestigationID] = useState('');
    const [accusedName, setAccusedName] = useState('');
    const { userData } = useAuth();
    const member_number = userData?.member_id;

    // حالات جديدة للاستيراد
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showResults, setShowResults] = useState(false); // حالة لعرض النتائج

    const arabicNumbers: { [key: number]: string } = {
        1: 'الأولى',
        2: 'الثانية',
        3: 'الثالثة',
        4: 'الرابعة',
        5: 'الخامسة',
        6: 'السادسة',
        7: 'السابعة',
        8: 'الثامنة',
        9: 'التاسعة',
        10: 'العاشرة',
        11: 'الحادية عشرة',
        12: 'الثانية عشرة',
        13: 'الثالثة عشرة',
        14: 'الرابعة عشرة',
        15: 'الخامسة عشرة',
        16: 'السادسة عشرة',
        17: 'السابعة عشرة',
        18: 'الثامنة عشرة',
        19: 'التاسعة عشرة',
        20: 'العشرون',
    };

    useEffect(() => {
        if (caseDate && casePrisonDate) {
            const startDate = new Date(caseDate);
            startDate.setDate(startDate.getDate() + parseInt(casePrisonDate, 10) - 1);
            const formattedDate = startDate.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });
            setCaseRenewalDate(formattedDate);
        }
    }, [caseDate, casePrisonDate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases/add`, {
                caseNumber,
                defendantName: accusedName,
                startDate: caseDate,
                imprisonmentDuration: casePrisonDate,
                issuingDepartment,
                type_case: caseType,
                member_number,
                officeNumber,
                year,
                investigationID
            });
            toast.success('تم إضافة القضية بنجاح');
            setCaseNumber('');
            setAccusedName('');
            setCaseDate('');
            setCasePrisonDate('');
            setCaseRenewalDate('');
            setIssuingDepartment('');
            setCaseType('');
            setOfficeNumber('');
            setYear('');
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

                const cases = jsonData.map((item: any) => ({
                    caseNumber: item['رقم القضية'],
                    year: item['السنة'],
                    type_case: item['نوع القضية'],
                    investigationID: item['رقم حصر التحقيق'],
                    defendantName: item['اسم المتهم'],
                    member_number: item['رقم العضو'],
                    startDate: convertArabicDate(item['بداية المدة']),
                    imprisonmentDuration: item['مدة الحبس'],
                    issuingDepartment: item['دائرة مصدر القرار'],
                    officeNumber: item['رقم الدائرة'],
                }));

                    setIsProcessing(true);
                let success = 0;
                let errors = 0;

                for (let i = 0; i < cases.length; i++) {
                    try {
                        if (!cases[i].startDate || isNaN(new Date(cases[i].startDate).getTime())) {
                            throw new Error('تاريخ غير صالح في الصف ' + (i + 1));
                        }

                        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases/add`, cases[i]);
                        success++;
                    } catch (error) {
                        errors++;
                        if (error instanceof Error) {
                            console.error(`خطأ في الصف ${i + 1}:`, error.message);
                        } else {
                            console.error(`خطأ في الصف ${i + 1}:`, error);
                        }
                    }

                    setUploadProgress((i + 1) / cases.length * 100);
                    setSuccessCount(success);
                    setErrorCount(errors);

                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                setIsProcessing(false);
                setShowResults(true); // إظهار النتائج بعد الانتهاء
                // حذف الملف المحدد بعد الانتهاء
                setSelectedFile(null);
                toast.success(`تم استيراد ${success} قضية بنجاح مع ${errors} أخطاء`);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error('حدث خطأ في معالجة الملف: ' + error.message);
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
            <div className="max-w-7xl mx-auto">
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
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                بيانات القضية
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                                {/* رقم القضية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم القضية</label>
                                    <Input
                                        type="text"
                                        value={caseNumber}
                                        onChange={(e) => setCaseNumber(e.target.value)}
                                        className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* السنة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">السنة</label>
                                    <Input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* نوع القضية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">نوع القضية</label>
                                    <Select
                                        value={caseType}
                                        onValueChange={setCaseType}
                                    >
                                        <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر النوع" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="جنحة">جنحة</SelectItem>
                                            <SelectItem value="جناية">جناية</SelectItem>
                                            <SelectItem value="اداري">اداري</SelectItem>
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
                                        className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* اسم المتهم */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">اسم المتهم</label>
                                    <Input
                                        type="text"
                                        value={accusedName}
                                        onChange={(e) => setAccusedName(e.target.value)}
                                        className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* رقم العضو */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم العضو</label>
                                    <Select disabled value={(member_number ?? '').toString()}>
                                        <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="رقم العضو" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </fieldset>

                        {/* معلومات التجديد */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                معلومات التجديد
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">


                                {/* بداية المدة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">بداية المدة</label>
                                    <Input
                                        type="date"
                                        value={caseDate}
                                        onChange={(e) => setCaseDate(e.target.value)}
                                        className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* مدة الحبس */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">مدة الحبس</label>
                                    <Input
                                        type="number"
                                        value={casePrisonDate}
                                        onChange={(e) => setCasePrisonDate(e.target.value)}
                                        className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                                        min="1"
                                    />
                                </div>

                                {/* موعد التجديد */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">موعد التجديد</label>
                                    <div className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-gray-50">
                                        {caseRenewalDate || '--/--/----'}
                                    </div>
                                </div>
                                                                {/* الدائرة مصدرة القرار */}
                                                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">الدائرة مصدرة القرار</label>
                                    <Select
                                        value={issuingDepartment}
                                        onValueChange={setIssuingDepartment}
                                    >
                                        <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر الدائرة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="جزئي">جزئي</SelectItem>
                                            <SelectItem value="مستأنف">مستأنف</SelectItem>
                                            <SelectItem value="جنايات">جناية</SelectItem>
                                            <SelectItem value="رئيس نيابة">رئيس نيابة</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* رقم الدائرة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم الدائرة</label>
                                    <Select
                                        value={officeNumber}
                                        onValueChange={setOfficeNumber}
                                    >
                                        <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر الرقم" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                                <SelectItem key={num} value={arabicNumbers[num]}>
                                                    {arabicNumbers[num]}
                                                </SelectItem>
                                            ))}
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