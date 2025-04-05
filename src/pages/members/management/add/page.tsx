'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { read, utils } from 'xlsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/userContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const initialAccusedState = {
    accusedName: '',
    defendantQuestion: '',
    victimQuestion: '',
    witnessQuestion: '',
    officerQuestion: '',
    technicalReports: '',
    reportType: '',
    actionOther: ''
};

const Page = () => {
    // بيانات القضية
    const [caseNumber, setCaseNumber] = useState('');
    const [year, setYear] = useState(0);
    const [caseType, setCaseType] = useState('');
    const [investigationID, setInvestigationID] = useState('');
    const { userData, token } = useAuth();
    const [searchParams] = useSearchParams();
    const member_number = userData?.member_id;
    const type = searchParams.get('type');
    const userID = userData?.id;
    const [accusation, setAccusation] = useState('');
    const [prosecutionOfficeId, setProsecutionOfficeId] = useState('');
    const officesAvailable: { id: string; name: string }[] =
        (userData?.officesAvailable as { id: string; name: string }[] | undefined) || [];
    const username = userData?.username;

    // بيانات المتهمين
    const [accusedsData, setAccusedsData] = useState<Array<any>>([]);
    const [currentAccused, setCurrentAccused] = useState(initialAccusedState);
    const [selectedAccusedIndex, setSelectedAccusedIndex] = useState<number>(-1);

    // استيراد من Excel
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showResults, setShowResults] = useState(false);

    const reportOptions = ['تم', 'لايوجد', 'حتى الآن'];

    const handleAddAccused = () => {
        if (!currentAccused.accusedName?.trim()) {
            toast.error('يجب إدخال اسم المتهم');
            return;
        }

        const newAccused = {
            ...currentAccused,
            investigationID,
            reportType: currentAccused.technicalReports === 'حتى الآن' ? currentAccused.reportType : '',
            actionOther: currentAccused.actionOther || 'لا يوجد'
        };

        if (selectedAccusedIndex === -1) {
            setAccusedsData([...accusedsData, newAccused]);
        } else {
            const updatedData = accusedsData.map((item, i) =>
                i === selectedAccusedIndex ? newAccused : item
            );
            setAccusedsData(updatedData);
        }

        setCurrentAccused(initialAccusedState);
        setSelectedAccusedIndex(-1);
    };

    const handleDeleteAccused = (index: number) => {
        if (index < 0 || index >= accusedsData.length) return;

        const newData = accusedsData.filter((_, i) => i !== index);
        setAccusedsData(newData);

        if (index === selectedAccusedIndex) {
            setSelectedAccusedIndex(-1);
            setCurrentAccused(initialAccusedState);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (accusedsData.length === 0) {
                toast.error('يجب إضافة متهم واحد على الأقل');
                return;
            }

            const hasInvalid = accusedsData.some(accused =>
                !accused?.accusedName?.trim()
            );

            if (hasInvalid) {
                toast.error('يوجد متهمين بدون أسماء');
                return;
            }

            const payload = {
                caseNumber: caseNumber.trim(),
                year,
                caseType: caseType.trim(),
                memberNumber: member_number,
                accusation,
                userID,
                prosecutionOfficeId,
                username: username?.trim(),
                accusedsData,
                investigationID
            };

            const req = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/add`, payload, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });

            setCaseNumber('');
            setYear(0);
            setCaseType('');
            setInvestigationID('');
            setAccusedsData([]);
            setCurrentAccused(initialAccusedState);

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
                    toast.error('حدث خطأ غير معروف');
                }
            } else {
                console.error('حدث خطأ غير معروف');
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

                const cases = jsonData.map((item: any) => {
                    if (!item['رقم القضية'] || !item['اسم المتهم'] || !item['رقم العضو']) {
                        throw new Error('بيانات ناقصة في أحد الصفوف');
                    }

                    return {
                        caseNumber: item['رقم القضية'],
                        year: item['السنة'],
                        caseType: item['نوع القضية'],
                        investigationID: item['رقم حصر التحقيق'],
                        accusation: item['التهمة'],
                        memberNumber: item['رقم العضو'],
                        prosecutionOfficeId: type,
                        userID,
                        username,
                        accusedsData: [{
                            accusedName: item['اسم المتهم']?.trim() || 'غير معرّف',
                            defendantQuestion: item['سؤال المتهم'] || 'لا يوجد',
                            victimQuestion: item['سؤال المجني عليه'] || 'لا يوجد',
                            witnessQuestion: item['سؤال الشهود'] || 'لا يوجد',
                            officerQuestion: item['سؤال الضابط'] || 'لا يوجد',
                            technicalReports: item['التقارير الفنية'] || 'لا يوجد',
                            reportType: item['نوع التقرير'] || '',
                            actionOther: item['إجراءات أخرى'] || 'لا يوجد',
                            investigationID: item['رقم حصر التحقيق']
                        }]
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
                        console.error(`خطأ في الصف ${i + 1}:`, error);
                    }

                    setUploadProgress((i + 1) / cases.length * 100);
                    setSuccessCount(success);
                    setErrorCount(errors);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                setIsProcessing(false);
                setShowResults(true);
                setSelectedFile(null);
                toast.success(`تم استيراد ${success} قضية بنجاح مع ${errors} أخطاء`);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'حدث خطأ في معالجة الملف');
                setIsProcessing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="h-[70px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم القضية</label>
                                    <Input
                                        type="text"
                                        value={caseNumber}
                                        onChange={(e) => setCaseNumber(e.target.value)}
                                        
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">السنة</label>
                                    <Input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        required
                                    />
                                </div>

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
                                    <label className="block text-sm font-medium text-gray-700">التهمة</label>
                                    <Input
                                        type="text"
                                        value={accusation}
                                        onChange={(e) => setAccusation(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">رقم العضو</label>
                                    <Input
                                        type="text"
                                        value={member_number || ''}
                                        disabled
                                    />
                                </div>

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

                        {/* بيانات المتهمين */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                بيانات المتهمين
                            </legend>
                            
                            <div className="mb-4 flex gap-4">
                                <Select
                                    value={selectedAccusedIndex.toString()}
                                    onValueChange={(val) => {
                                        const index = parseInt(val);
                                        if (index >= 0 && index < accusedsData.length) {
                                            setSelectedAccusedIndex(index);
                                            setCurrentAccused(accusedsData[index]);
                                        } else {
                                            setSelectedAccusedIndex(-1);
                                            setCurrentAccused(initialAccusedState);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-1/3">
                                        <SelectValue placeholder="اختر متهم" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accusedsData.map((accused, index) => (
                                            <SelectItem 
                                                key={index} 
                                                value={index.toString()}
                                                disabled={!accused}
                                            >
                                                {accused?.accusedName || 'مجهول'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setCurrentAccused(initialAccusedState);
                                        setSelectedAccusedIndex(-1);
                                    }}
                                    variant="outline"
                                >
                                    إضافة جديد
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">اسم المتهم</label>
                                    <Input
                                        value={currentAccused.accusedName}
                                        onChange={(e) => setCurrentAccused({
                                            ...currentAccused,
                                            accusedName: e.target.value
                                        })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال المتهم</label>
                                    <Select
                                        value={currentAccused.defendantQuestion}
                                        onValueChange={(val) => setCurrentAccused({
                                            ...currentAccused,
                                            defendantQuestion: val
                                        })}
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال المجني عليه</label>
                                    <Select
                                        value={currentAccused.victimQuestion}
                                        onValueChange={(val) => setCurrentAccused({
                                            ...currentAccused,
                                            victimQuestion: val
                                        })}
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال الشهود</label>
                                    <Select
                                        value={currentAccused.witnessQuestion}
                                        onValueChange={(val) => setCurrentAccused({
                                            ...currentAccused,
                                            witnessQuestion: val
                                        })}
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سؤال الضابط</label>
                                    <Select
                                        value={currentAccused.officerQuestion}
                                        onValueChange={(val) => setCurrentAccused({
                                            ...currentAccused,
                                            officerQuestion: val
                                        })}
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">تقارير فنية</label>
                                    <Select
                                        value={currentAccused.technicalReports}
                                        onValueChange={(val) => setCurrentAccused({
                                            ...currentAccused,
                                            technicalReports: val
                                        })}
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

                                {currentAccused.technicalReports === 'حتى الآن' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">نوع التقرير</label>
                                        <Input
                                            type="text"
                                            value={currentAccused.reportType || ''}
                                            onChange={(e) => setCurrentAccused({
                                                ...currentAccused,
                                                reportType: e.target.value
                                            })}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">إجراءات أخرى</label>
                                    <Select
                                        value={currentAccused.actionOther}
                                        onValueChange={(val) => setCurrentAccused({
                                            ...currentAccused,
                                            actionOther: val
                                        })}
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
                            </div>

                            <div className="mt-6 flex justify-end gap-4">
                                <Button
                                    type="button"
                                    onClick={handleAddAccused}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {selectedAccusedIndex === -1 ? 'إضافة متهم' : 'حفظ التعديلات'}
                                </Button>
                                
                                {selectedAccusedIndex !== -1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => handleDeleteAccused(selectedAccusedIndex)}
                                    >
                                        حذف المتهم
                                    </Button>
                                )}
                            </div>

                            {accusedsData.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-2">المتهمين المضافين:</h3>
                                    <ul className="space-y-2">
                                        {accusedsData.map((accused, index) => (
                                            <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{accused?.accusedName || 'غير معرّف'}</span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (accusedsData[index]) {
                                                                setCurrentAccused(accusedsData[index]);
                                                                setSelectedAccusedIndex(index);
                                                            }
                                                        }}
                                                    >
                                                        تعديل
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteAccused(index)}
                                                    >
                                                        حذف
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </fieldset>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg"
                                disabled={accusedsData.length === 0}
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