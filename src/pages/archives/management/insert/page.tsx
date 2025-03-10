import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from 'react-hot-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const offices = [
    { id: "1", name: "النيابة الكلية" },
    { id: "2", name: "نيابة قسم اول المنصورة الجزئية" },
    { id: "3", name: "نيابة قسم ثاني المنصورة الجزئية" },
    { id: "4", name: "نيابة مركز المنصورة الجزئية" },
    { id: "5", name: "نيابة طلخا الجزئية" },
    { id: "6", name: "نيابة السنبلاوين الجزئية" },
    { id: "7", name: "نيابة اجا الجزئية" },
    { id: "8", name: "نيابة قسم ميت غمر الجزئية" },
    { id: "9", name: "نيابة تمي الامديد الجزئية" },
    { id: "10", name: "نيابة مركز ميت غمر الجزئية" }
];

const Insert = () => {
    const [serialNumber, setSerialNumber] = useState('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (
            Number(serialNumber) < 0 ||
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
                    serialNumber: Number(serialNumber),
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

                }
            );

            if (response.data.success) {
                setSerialNumber('');
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
            toast.error('حدث خطأ أثناء الإضافة!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="h-[60px] text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    إضافة الحرز
                </h1>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* قسم بيانات الحرز */}
                        <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                            <legend className="px-2 text-xl font-semibold text-blue-600">
                                بيانات الحرز
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                {/* مكتب النيابة */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">مكتب النيابة</label>
                                    <Select
                                        value={prosecutionOfficeId}
                                        onValueChange={setProsecutionOfficeId}
                                    >
                                        <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر مكتب النيابة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {offices.map((office) => (
                                                <SelectItem key={office.id} value={office.id}>
                                                    {office.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* مسلسل */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right">مسلسل</label>
                                    <input
                                        type="number"
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)}
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
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 text-right"> نوع القضية لرقم القضية</label>
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
                                    <label className="block text-sm font-medium text-gray-700 text-right">حالة الحرز</label>
                                    <Select
                                        value={statusEvidence}
                                        onValueChange={setStatusEvidence}
                                    >
                                        <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="اختر حالة الحرز" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="على ذمة التحقيق">على ذمة التحقيق</SelectItem>
                                            <SelectItem value="جاهز للتسليم">جاهز للتسليم</SelectItem>
                                            <SelectItem value="جاهز للبيع">جاهز للبيع</SelectItem>
                                            <SelectItem value="جاهز للاعدام">جاهز للإعدام</SelectItem>
                                        </SelectContent>
                                    </Select>
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