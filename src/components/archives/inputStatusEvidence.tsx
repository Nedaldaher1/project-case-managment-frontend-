import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const inputStatusEvidence = ({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) => {

    return (
        <>
            <label className="block text-sm font-medium text-gray-700 text-right">حالة الحرز</label>
            <Select
                value={value}
                onValueChange={onValueChange}
            >
                <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="اختر حالة الحرز" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="على ذمة التحقيق">على ذمة التحقيق</SelectItem>
                    <SelectItem value="جاهز للتسليم">جاهز للتسليم</SelectItem>
                    <SelectItem value="جاهز للبيع">جاهز للبيع</SelectItem>
                    <SelectItem value="جاهز للاعدام">جاهز للإعدام</SelectItem>
                    <SelectItem value="تم البيع">تم البيع </SelectItem>
                    <SelectItem value="تم التسليم"> تم التسليم</SelectItem>
                    <SelectItem value="تم الاعدام">تم الإعدام</SelectItem>
                </SelectContent>
            </Select>
        </>
    )
}

export default inputStatusEvidence;