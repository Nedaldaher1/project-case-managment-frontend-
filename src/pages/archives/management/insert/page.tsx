import { useEffect, useState } from "react";
import { useAuth } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useSearchParams } from 'react-router-dom'
import InputStatusEvidence from "@/components/archives/inputStatusEvidence";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { read, utils } from 'xlsx';



const Insert = () => {
    const [prosecutionOfficeId, setProsecutionOfficeId] = useState('');
    const [itemNumber, setItemNumber] = useState('');
    const [totalNumber, setTotalNumber] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [shelfNumber, setShelfNumber] = useState('');
    const [charge, setCharge] = useState('');
    const [seizureStatement, setSeizureStatement] = useState('');
    const [disposalOfSeizure, setDisposalOfSeizure] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [numberCase, setNumberCase] = useState('');
    const [prosecutionDetentionDecision, setProsecutionDetentionDecision] = useState('');
    const [finalCourtJudgment, setFinalCourtJudgment] = useState('');
    const [year, setYear] = useState<string>('');
    const [statusEvidence, setStatusEvidence] = useState('');
    const [typeCaseTotalNumber, setTypeCaseTotalNumber] = useState('');
    const [typeCaseNumber, setTypeCaseNumber] = useState('');
    const [serialNumber, setSerialNumber] = useState<number | null>(null);
    const { token, userData } = useAuth();
    const officesAvailable: { id: string; name: string }[] =
        (userData?.officesAvailable as { id: string; name: string }[] | undefined) || [];
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type')
    // حالات جديدة للاستيراد
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [notEditCount, setNotEditCount] = useState(0);
    const [hasEditCount, setHasEditCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showResults, setShowResults] = useState(false); // حالة لعرض النتائج

    // تحويل البيانات إلى مصفوفة آمنة مع قيمة افتراضية

    useEffect(() => {
        const checkForKeywords = () => {
          // قائمة الكلمات المطلوبة
          const keywords = [
            'سيف',
            'السونكات',
            'الخنجر',
            'قوس',
            'مطوة',
            'ساطور',
            'سكينة',
            'بلطة',
            'جنزير',
            'سنجة',
            'قطر',
            'شفرة',
            'عصاية',
            'شنطة',
            'فلاشة',
            'حافظة',
            'جلدية',
            'شنطه',
            'مطواه'
          ];
      
          // تحويل النص إلى حالة بحث موحدة
          const textToCheck = seizureStatement?.toLowerCase() || '';
      
          // التحقق من وجود أي كلمة ممنوعة
          const found = keywords.some(keyword => 
            textToCheck.includes(keyword.toLowerCase())
          );
      
          if (found && statusEvidence !== 'جاهز للإعدام') {
            setStatusEvidence('جاهز للإعدام');
          } else if (!found && statusEvidence === 'جاهز للإعدام') {
            setStatusEvidence(''); // أو القيمة الافتراضية
          }
        };
      
        checkForKeywords();
      }, [seizureStatement]);
      useEffect(() => {
        console.log('تم تحديث حالة الحرز:', statusEvidence); // ← هذه ستظهر القيمة المحدثة
      }, [statusEvidence]); // ← هذا الـ effect سينفذ عند كل تغيير في statusEvidence

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (
            Number(itemNumber) < 0 ||
            Number(totalNumber) < 0 ||
            Number(roomNumber) < 0 ||
            Number(referenceNumber) < 0 ||
            Number(shelfNumber) < 0 ||
            Number(numberCase) < 0
        ) {
            toast.error('لا يمكن إدخال أرقام سالبة!');
            setIsSubmitting(false);
            return;
        }

        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            const response = await axios.post(
                `${import.meta.env.VITE_REACT_APP_API_URL}/archives/data/create`,
                {
                    serialNumber,
                    itemNumber: Number(itemNumber),
                    charge,
                    seizureStatement,
                    disposalOfSeizure,
                    prosecutionDetentionDecision,
                    finalCourtJudgment,
                    totalNumber,
                    roomNumber: Number(roomNumber),
                    referenceNumber: Number(referenceNumber),
                    shelfNumber: Number(shelfNumber),
                    prosecutionOfficeId: Number(prosecutionOfficeId),
                    numberCase: Number(numberCase),
                    year: Number(year),
                    statusEvidence,
                    typeCaseTotalNumber,
                    typeCaseNumber
                },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    }
                }
            );


            if (response.data.success) {
                setProsecutionOfficeId('');
                setItemNumber('');
                setTotalNumber('');
                setRoomNumber('');
                setReferenceNumber('');
                setShelfNumber('');
                setCharge('');
                setSeizureStatement('');
                setDisposalOfSeizure('');
                setNumberCase('');
                setProsecutionDetentionDecision('');
                setFinalCourtJudgment('');
                setYear('');
                setStatusEvidence('');
                setTypeCaseTotalNumber('');
                setTypeCaseNumber('');
                toast.success('تم إضافة الأرشيف بنجاح!');

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
        } finally {
            setIsSubmitting(false);
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
                    return {
                        itemNumber: item['رقم الأشياء'],
                        numberCase: item['رقم القضية'],
                        serialNumber: item[ 'المسلسل'],
                        typeCaseNumber: item['نوع القضية'],
                        year: item['السنة'],
                        charge: item['التهمة'],
                        seizureStatement: item['بيان الحرز'],
                        totalNumber: item['الرقم الكلي'],
                        typeCaseTotalNumber: item['نوع القضية للرقم الكلي'],
                        roomNumber: item['رقم الغرفة'],
                        referenceNumber: item['رقم الاستاند'],
                        shelfNumber: item['رقم الرف'],
                        prosecutionDetentionDecision: item['قرار النيابة في الحرز'],
                        finalCourtJudgment: item['حكم المحكمة النهائي'],
                        statusEvidence: item['حالة الحرز'],
                        prosecutionOfficeId: type,
                    };
                });

                setIsProcessing(true);
                let success = 0;
                let errors = 0;
                let notEdit = 0;
                let hasEdit = 0;

                for (let i = 0; i < cases.length; i++) {
                    try {
                        const res = await axios.post(
                            `${import.meta.env.VITE_REACT_APP_API_URL}/archives/data/create`,
                            cases[i],
                            {
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : '',
                                }
                            }
                        );
                        if (res.status === 202) {
                            notEdit++;
                        }
                        if (res.status === 201) {
                            hasEdit++;
                        }
                        if (res.status == 200) {
                            success++;
                        }
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
                    setNotEditCount(notEdit);
                    setHasEditCount(hasEdit);


                    await new Promise(resolve => setTimeout(resolve, 100)); // تقليل التأخير
                }

                setIsProcessing(false);
                setShowResults(true);
                setSelectedFile(null);
                toast.success(`البيانات التي تمت إضافتها: ${success}, البيانات التي لم يتم تعديلها أو كانت موجودة مسبقًا: ${notEdit}, الأخطاء: ${errors}`);
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
            <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="h-[60px] text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إضافة الحرز
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
                                    <div className="space-y-6 text-center z-50">
                                        {isProcessing ? (
                                            <>
                                                <Progress value={uploadProgress} className="h-3 bg-red" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-green-600">الناجحة: {successCount}</div>
                                                    <div className="text-yellow-600">لم يتم التعديل: {notEditCount}</div>
                                                    <div className="text-blue-600">تم التعديل: {hasEditCount}</div>
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

                        {/* قسم بيانات الحرز */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                بيانات الحرز
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">



                             
                                {/* رقم المسلسل */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">رقم المسلسل</label>
                                    <input
                                        type="number"
                                        value={serialNumber || ''}
                                        onChange={(e) => setSerialNumber(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* رقم الأشياء */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">رقم الأشياء</label>
                                    <input
                                        type="number"
                                        value={itemNumber}
                                        onChange={(e) => setItemNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        min="0"
                                        required

                                    />
                                </div>

                                {/* رقم القضية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">رقم القضية</label>
                                    <input
                                        type="number"
                                        value={numberCase}
                                        onChange={(e) => setNumberCase(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        required
                                        min="0"
                                    />
                                </div>

                                {/* نوع القضية */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right"> نوع القضية  </label>
                                    <Select
                                        value={typeCaseNumber}
                                        onValueChange={setTypeCaseNumber}
                                    >
                                        <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر نوع القضية" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"جنح"}>
                                                جنح
                                            </SelectItem>
                                            <SelectItem value={"جناية"}>
                                                جناية
                                            </SelectItem>
                                            <SelectItem value={"اداري"}>
                                                اداري
                                            </SelectItem>
                                            <SelectItem value={"اقتصادية"}>
                                                اقتصادية
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* السنة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">السنة</label>
                                    <input
                                        type="text"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"

                                    />
                                </div>
                                {/* التهمة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">التهمة</label>
                                    <input
                                        type="text"
                                        value={charge}
                                        onChange={(e) => setCharge(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"

                                    />
                                </div>

                                {/* بيان الحرز */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">بيان الحرز</label>
                                    <input
                                        type="text"
                                        value={seizureStatement}
                                        onChange={(e) => setSeizureStatement(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"

                                    />
                                </div>

                                {/* الرقم الكلي */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">الرقم الكلي</label>
                                    <input
                                        type="text"
                                        value={totalNumber}
                                        onChange={(e) => setTotalNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        min="0"

                                    />
                                </div>

                                {/* نوع القضية  للرقم الكلي*/}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right"> نوع القضية لرقم الكلي</label>
                                    <Select
                                        value={typeCaseTotalNumber}
                                        onValueChange={setTypeCaseTotalNumber}
                                    >
                                        <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر نوع القضية" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"جنح"}>
                                                جنح
                                            </SelectItem>
                                            <SelectItem value={"جناية"}>
                                                جناية
                                            </SelectItem>
                                            <SelectItem value={"اداري"}>
                                                اداري
                                            </SelectItem>
                                            <SelectItem value={"اقتصادية"}>
                                                اقتصادية
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* النيابة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">النيابة</label>
                                    <Select
                                        value={prosecutionOfficeId}
                                        onValueChange={(value) => setProsecutionOfficeId(value)}
                                    >
                                        <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر النيابة">
                                                {officesAvailable.find(office => office.id === prosecutionOfficeId)?.name}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {officesAvailable.map((office) => (
                                                <SelectItem key={office.id} value={String(office.id)}>
                                                    {office.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </fieldset>

                        {/* قسم مكان تواجد الحرز */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                مكان تواجد الحرز
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                {/* رقم الغرفة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">رقم الغرفة</label>
                                    <input
                                        type="number"
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        min="0"

                                    />
                                </div>

                                {/* رقم الاستاند */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">رقم الاستاند</label>
                                    <input
                                        type="number"
                                        value={referenceNumber}
                                        onChange={(e) => setReferenceNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        min="0"

                                    />
                                </div>

                                {/* رقم الرف */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">رقم الرف</label>
                                    <input
                                        type="number"
                                        value={shelfNumber}
                                        onChange={(e) => setShelfNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        min="0"

                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* قسم التصرف في الحرز */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                التصرف في الحرز
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                {/* قرار النيابة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">قرار النيابة</label>
                                    <input
                                        type="text"
                                        value={prosecutionDetentionDecision}
                                        onChange={(e) => setProsecutionDetentionDecision(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"

                                    />
                                </div>

                                {/* حكم المحكمة النهائي */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">حكم المحكمة النهائي</label>
                                    <input
                                        type="text"
                                        value={finalCourtJudgment}
                                        onChange={(e) => setFinalCourtJudgment(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"

                                    />
                                </div>

                                {/* حالة الحرز */}
                                <div className="space-y-2">
                                    <InputStatusEvidence value={statusEvidence} onValueChange={setStatusEvidence} />
                                </div>
                            </div>
                        </fieldset>

                        {/* زر الإرسال */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl"
                            >
                                {isSubmitting ? 'جارٍ الإضافة...' : 'إضافة'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Insert;  