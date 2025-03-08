import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/context/userContext';

const Page = () => {
    const [caseNumber, setCaseNumber] = useState('');
    const [accusedName, setAccusedName] = useState('');
    const [caseDate, setCaseDate] = useState('');
    const [casePrisonDate, setCasePrisonDate] = useState('');
    const [caseRenewalDate, setCaseRenewalDate] = useState('');
    const [memberLocation, setMemberLocation] = useState('');
    const [caseType, setcaseType] = useState('');
    const { tempUserData} = useAuth();
    const member_number = tempUserData?.member_id;



    useEffect(() => {
        if (caseDate && casePrisonDate) {
            const startDate = new Date(caseDate);
            startDate.setDate(startDate.getDate() + parseInt(casePrisonDate, 10) - 1);
    
            // تحويل التاريخ إلى التنسيق العربي مع الأرقام العربية
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
                member_location: memberLocation,
                type_case: caseType,
                member_number: member_number
            });
            toast.success('تم إضافة القضية بنجاح');

            // Clear data of inputs
            setCaseNumber('');
            setAccusedName('');
            setCaseDate('');
            setCasePrisonDate('');
            setCaseRenewalDate('');
            setMemberLocation('');
        } catch (error) {
            toast.error('فشلت عملية إضافة القضية');
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        

        switch (name) {
            case 'caseNumber':
                setCaseNumber(value);
                break;
            case 'accusedName':
                setAccusedName(value);
                break;
            case 'caseDate':
                setCaseDate(value);
                break;
            case 'casePrisonDate':
                setCasePrisonDate(value);
                break;
            case 'memberLocation':
                setMemberLocation(value);
                break;
          
            case 'caseType':
                setcaseType(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex items-center justify-center h-[120vh]">
            <div className=" w-[427px] h-[660px] bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <form onSubmit={handleSubmit} className="flex w-[348px] h-[433px] justify-center items-center content-center gap-x-[36px] gap-y-[40px] flex-shrink-0 flex-wrap">
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white  text-sm" htmlFor="accusedName">اسم المتهم</label>
                        <Input type="text" value={accusedName} onChange={handleChange} name="accusedName" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseNumber">رقم القضية</label>
                        <Input type="text" value={caseNumber} onChange={handleChange} name="caseNumber" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseDate">بداية المدة</label>
                        <Input type="date" value={caseDate} onChange={handleChange} name="caseDate" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="casePrisonDate">مدة الحبس</label>
                        <Input type="number" value={casePrisonDate} onChange={handleChange} name="casePrisonDate" min="1" />
                    </div>

                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseRenewalDate">رقم العضو</label>
                        <Select  dir="rtl" disabled value={(member_number ?? '').toString()}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="رقم العضو" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseRenewalDate">مكان التجديد</label>
                        <Select dir="rtl" value={memberLocation} onValueChange={(value) => setMemberLocation(value)}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="مكان التجديد" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="جزئي">جزئي</SelectItem>
                                <SelectItem value="مستأنف">مستأنف</SelectItem>
                                <SelectItem value="جنايات">جنايات</SelectItem>
                                <SelectItem value="رئيس نيابة">رئيس نيابة</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseRenewalDate">نوع القضية</label>
                        <Select dir="rtl" value={caseType} onValueChange={(value) => setcaseType(value)}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="نوع القضية" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="جنحة ">جنحة </SelectItem>
                            <SelectItem value="جناية  ">جناية  </SelectItem>
                            <SelectItem value="اداري ">اداري </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div dir="rtl" className="w-[173px] flex items-center justify-center flex-col gap-4">
                        <label className=" text-white text-sm" htmlFor="caseRenewalDate">موعد التجديد</label>
                        <div  className="w-[173px] bg-white h-[40px] rounded-sm flex items-center justify-center ">
                            <p>{caseRenewalDate}</p>
                        </div>
                    </div>

                    <Button type="submit" className="w-[252px] bg-[#45369f] hover:bg-[#5643bd]">
                        إضافة
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Page;
