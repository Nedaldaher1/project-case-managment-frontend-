
import { Input } from "@/components/ui/input";


const officerName = ({ value, onValueChange , officerQuestion }: { value: string; onValueChange: (value: string) => void ; officerQuestion:string } ) => {

    return (
        <>
            <label className="block text-sm font-medium text-gray-700">اسم الظابط</label>
            <Input
                type="text"
                value={officerQuestion === 'حتى الآن' ? value : ''}
                onChange={(e) => onValueChange(e.target.value)}
                required={officerQuestion === 'حتى الآن'}
            />
        </>

    )
}

export default officerName;