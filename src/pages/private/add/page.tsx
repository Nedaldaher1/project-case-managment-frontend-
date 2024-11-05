'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { useUser } from "@/context/userContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Page = () => {
    const [caseNumber, setCaseNumber] = useState('');
    const [accusation, setAccusation] = useState('');
    const [technicalReports, setTechnicalReports] = useState('');
    const { member_number } = useUser();
    const [action_Other, setActionOther] = useState('');

    // حالة الأسئلة
    const [defendantStatus, setDefendantStatus] = useState('');
    const [officerStatus, setOfficerStatus] = useState('');
    const [victimStatus, setVictimStatus] = useState('');
    const [witnessStatus, setWitnessStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            const id = Cookies.get('uuid');
            const req = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/add`, {
                caseNumber,
                memberNumber: member_number,
                accusation,
                defendantQuestion: defendantStatus,
                officerQuestion: officerStatus,
                victimQuestion: victimStatus,
                witnessQuestion: witnessStatus,
                technicalReports,
                actionOther: action_Other,
                userId: id
            });

            // Clear data of inputs
            setCaseNumber('');
            setAccusation('');
            setDefendantStatus('');
            setOfficerStatus('');
            setVictimStatus('');
            setWitnessStatus('');
            setTechnicalReports('');
            setActionOther('');

            if (req.data.success) {
                toast.success('تم إضافة القضية بنجاح');
            } else {
                toast.error('فشلت عملية إضافة القضية');
                console.log(req.data.error);
            }
        } catch (error) {
            toast.error('فشلت عملية إضافة القضية');
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center h-[120vh]">
            <div className=" w-[427px] h-[660px] bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <form onSubmit={handleSubmit} className="flex w-[348px] h-[433px] justify-center items-center content-center gap-x-[36px] gap-y-[40px] flex-shrink-0 flex-wrap">
                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm" htmlFor="caseNumber">رقم القضية</label>
                        <Input type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} name="caseNumber" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm" htmlFor="accusation">التهمة</label>
                        <Input type="text" value={accusation} onChange={(e) => setAccusation(e.target.value)} name="accusation" />
                    </div>

                    {/* سؤال المتهم */}
                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm">سؤال المتهم</label>
                        <Select dir="rtl" value={defendantStatus} onValueChange={setDefendantStatus}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="اختيار الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                <SelectItem value="تم">تم</SelectItem>
                                <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* سؤال الظابط */}
                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm">سؤال الظابط</label>
                        <Select dir="rtl" value={officerStatus} onValueChange={setOfficerStatus}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="اختيار الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                <SelectItem value="تم">تم</SelectItem>
                                <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* سؤال المجني عليه */}
                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm">سؤال المجني عليه</label>
                        <Select dir="rtl" value={victimStatus} onValueChange={setVictimStatus}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="اختيار الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                <SelectItem value="تم">تم</SelectItem>
                                <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* سؤال الشهود */}
                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm">سؤال الشهود</label>
                        <Select dir="rtl" value={witnessStatus} onValueChange={setWitnessStatus}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="اختيار الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                <SelectItem value="تم">تم</SelectItem>
                                <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div dir="rtl" className="w-[156px]">
                        <label className="text-white text-sm" htmlFor="technicalReports">تقارير فنية</label>
                        <Select dir="rtl" value={technicalReports} onValueChange={setTechnicalReports}>
                            <SelectTrigger className="w-[156px]">
                                <SelectValue placeholder="اختيار الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                <SelectItem value="تم">تم</SelectItem>
                                <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div dir="rtl" className="w-[156px]">
                            <label className="text-white" htmlFor="technicalReports">اجراءات اخرى</label>
                            <Select dir="rtl" value={action_Other} onValueChange={setActionOther}>
                                <SelectTrigger  >
                                    <SelectValue placeholder="اختيار الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
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
