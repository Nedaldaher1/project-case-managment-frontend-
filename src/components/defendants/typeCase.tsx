import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const TypeCase = ({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) => {

    return(
        <>
        <label className="block text-sm font-medium text-gray-700">نوع القضية</label>
        <Select
            value={value}
            onValueChange={onValueChange}
        >
            <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="جنح">جنح</SelectItem>
                <SelectItem value="اداري">اداري</SelectItem>
                <SelectItem value="جنحة اقتصادية">جنحة اقتصادية</SelectItem>
                <SelectItem value="جنايات">جنايات</SelectItem>
                <SelectItem value="جنحة طفل">جنحة طفل</SelectItem>
            </SelectContent>
        </Select>
        </>
    )
}

export default TypeCase;