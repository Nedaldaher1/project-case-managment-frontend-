
import { Input } from "@/components/ui/input";


const actionType = ({ value, onValueChange, actionOther }: { value: string; onValueChange: (value: string) => void; actionOther: string }) => {

    return (
        <>
            <label className="block text-sm font-medium text-gray-700">نوع الاجراءات</label>
            <Input
                type="text"
                value={actionOther === 'حتى الآن' ? value : ''}
                onChange={(e) => onValueChange(e.target.value)}
                required={actionOther === 'حتى الآن'}
            />
        </>

    )
}

export default actionType;