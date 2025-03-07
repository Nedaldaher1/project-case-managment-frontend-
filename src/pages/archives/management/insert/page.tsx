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

// قائمة النيابات الثابتة
const offices = [
    { id: "1", name: "النيابة الكلية" },
    { id: "2", name: "نيابة قسم اول الجزئية" },
    { id: "3", name: "نيابة قسم ثاني الجزئية" },
    { id: "4", name: "نيابة مركز المنصورة" },
    { id: "5", name: "نيابة طلخا" },
    { id: "6", name: "نيابة السنبلاوين" },
    { id: "7", name: "نيابة اجا" },
    { id: "8", name: "نيابة ميت غمر" },
    { id: "9", name: "نيابة تمي الامديد" },
];

const Insert = () => {
    // حالات الحقول
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

    // دالة إرسال البيانات
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // التحقق من عدم وجود أرقام سالبة
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
            const response = await axios.post('http://localhost:3000/archives/data/create', {
                serialNumber: Number(serialNumber),
                itemNumber: Number(itemNumber),
                charge,
                seizureStatement,
                disposalOfSeizure,
                prosecutionDetentionDecision,
                finalCourtJudgment,
                totalNumber: Number(totalNumber),
                roomNumber: Number(roomNumber),
                referenceNumber: Number(referenceNumber),
                shelfNumber: Number(shelfNumber),
                prosecutionOfficeId: Number(prosecutionOfficeId),
                numberCase: Number(numberCase)
            });

            if (response.data.success) {
                // مسح الحقول
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

                toast.success('تم إضافة الأرشيف بنجاح!');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء الإضافة!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex items-center justify-center max-w-[1200px] h-screen gap-16">
                <div className="flex justify-center items-center text-white shadow-xl text-xl w-[1050px] h-[600px] bg-gray-950 rounded-lg">
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-[800px] h-[600px] flex flex-col items-center justify-center gap-8"
                    >
                        {/* الصف الأول: مسلسل، قسم النيابة، رقم الأشياء */}
                        <div className="flex gap-16">
                            {/* مسلسل */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">مسلسل</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>

                            {/* قسم النيابة */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">قسم النيابة</label>
                                <Select
                                    value={prosecutionOfficeId}
                                    onValueChange={setProsecutionOfficeId}
                                >
                                    <SelectTrigger className="text-black bg-white rounded-xl">
                                        <SelectValue placeholder="اختر النيابة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {offices.map((office) => (
                                            <SelectItem
                                                key={office.id}
                                                value={office.id}
                                            >
                                                {office.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* رقم الأشياء */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">رقم الأشياء</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={itemNumber}
                                    onChange={(e) => setItemNumber(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* الصف الثاني: الرقم الكلي، رقم الغرفة، رقم الاستاند */}
                        <div className="flex gap-16">
                            {/* الرقم الكلي */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">الرقم الكلي</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={totalNumber}
                                    onChange={(e) => setTotalNumber(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>

                            {/* رقم الغرفة */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">رقم الغرفة</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={roomNumber}
                                    onChange={(e) => setRoomNumber(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>

                            {/* رقم الاستاند */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">رقم الاستاند</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* الصف الثالث: رقم الرف، التهمة، بيان الحرز */}
                        <div className="flex gap-16">
                            {/* رقم الرف */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">رقم الرف</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={shelfNumber}
                                    onChange={(e) => setShelfNumber(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>

                            {/* التهمة */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">التهمة</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="text"
                                    value={charge}
                                    onChange={(e) => setCharge(e.target.value)}
                                    required
                                />
                            </div>

                            {/* بيان الحرز */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">بيان الحرز</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="text"
                                    value={seizureStatement}
                                    onChange={(e) => setSeizureStatement(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* الصف الرابع: التصرف في الحرز */}
                        <div className="flex gap-16">
                            {/* التصرف في الحرز */}
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">التصرف في الحرز</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="text"
                                    value={disposalOfSeizure}
                                    onChange={(e) => setDisposalOfSeizure(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">رقم القضية</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="number"
                                    value={numberCase}
                                    onChange={(e) => setNumberCase(e.target.value)}
                                    required
                                    min="0"
                                />
                            </div>
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end"> حكم المحكمة النهائي</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="text"
                                    value={finalCourtJudgment}
                                    onChange={(e) => setFinalCourtJudgment(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-16">
                            <div className="w-[200px] flex flex-col items-center justify-center gap-2">
                                <label className="self-end">قرار النيابة في الحرز</label>
                                <input
                                    className="p-1 text-black outline-none bg-white rounded-xl"
                                    type="text"
                                    value={prosecutionDetentionDecision}
                                    onChange={(e) => setProsecutionDetentionDecision(e.target.value)}
                                    required
                                />
                            </div>
                            
                        </div>


                        {/* زر الحفظ */}
                        <Button
                            type="submit"
                            className="w-[200px] h-[40px] bg-gray-200 rounded-xl text-black"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Insert;