import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogEditCasePriavteProps } from "@/types/DialogEditCaseProps";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/userContext';

interface UpdatedCaseFields {
    id: string;
    caseNumber?: string;
    memberNumber?: string;
    accusation?: string;
    defendantQuestion?: string;
    officerQuestion?: string;
    victimQuestion?: string;
    witnessQuestion?: string;
    technicalReports?: string;
    caseReferral?: string;
    isReadyForDecision?: boolean;
    actionOther?: string;
}

const ModalEditCase = ({ children, caseID, caseNumber, accusation, defendantQuestion, officerQuestion, victimQuestion, witnessQuestion, technicalReports, caseReferral, isReadyForDecision,actionOther }: DialogEditCasePriavteProps) => {
    const [case_Number, setCaseNumber] = useState(caseNumber);
    const { userData } = useAuth();
    const [accus_ation, setAccusation] = useState(accusation);
    const [defendant_Question, setDefendantQuestion] = useState(defendantQuestion);
    const [officer_Question, setOfficerQuestion] = useState(officerQuestion);
    const [victim_Question, setVictimQuestion] = useState(victimQuestion);
    const [witness_Question, setWitnessQuestion] = useState(witnessQuestion);
    const [technical_Reports, setTechnicalReports] = useState(technicalReports);
    const [caseRe_ferral, setCaseReferral] = useState(caseReferral);
    const [isReadyFor_Decision, setIsReadyForDecision] = useState(isReadyForDecision);
    const [action_Other, setActionOther] = useState(actionOther);
    const member_number = userData?.member_id;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedFields: UpdatedCaseFields = { id: caseID.toString() };

        if (case_Number) updatedFields.caseNumber = case_Number;
        if (member_number) updatedFields.memberNumber = member_number.toString();
        if (accus_ation) updatedFields.accusation = accus_ation;
        if (defendant_Question) updatedFields.defendantQuestion = defendant_Question;
        if (officer_Question) updatedFields.officerQuestion = officer_Question;
        if (victim_Question) updatedFields.victimQuestion = victim_Question;
        if (witness_Question) updatedFields.witnessQuestion = witness_Question;
        if (technical_Reports) updatedFields.technicalReports = technical_Reports;
        if (caseRe_ferral) updatedFields.caseReferral = caseRe_ferral;
        if(action_Other) updatedFields.actionOther = action_Other;
        updatedFields.isReadyForDecision = isReadyFor_Decision;

        if (Object.keys(updatedFields).length > 1) {
            try {
                if (!import.meta.env.VITE_REACT_APP_API_URL) {
                    throw new Error('API URL is not defined');
                }
                const res = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/edit`, updatedFields);
                toast.success('تم التحديث بنجاح!');
            } catch (error) {
                toast.error('فشلت عملية التحديث');
                console.error(error);
            }
        } else {
            toast.error('يرجى ملء حقل واحد على الأقل للتحديث');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'caseNumber':
                setCaseNumber(value);
                break;

            case 'accusation':
                setAccusation(value);
                break;
            case 'defendantQuestion':
                setDefendantQuestion(value);
                break;
            case 'officerQuestion':
                setOfficerQuestion(value);
                break;
            case 'victimQuestion':
                setVictimQuestion(value);
                break;
            case 'witnessQuestion':
                setWitnessQuestion(value);
                break;
            case 'technicalReports':
                setTechnicalReports(value);
                break;
            case 'caseReferral':
                setCaseReferral(value);
                break;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-[#1B2431]  text-white border-none">
                <DialogHeader>
                    <DialogTitle>تعديل القضية</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="caseNumber">رقم القضية</label>
                            <Input name="caseNumber" value={case_Number} onChange={handleChange} type="text" min="1" placeholder="رقم القضية" className="bg-[#283444] text-white w-full" />
                        </div>
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="memberNumber">رقم العضو</label>
                            <Select dir="rtl" disabled value={member_number ? member_number.toString() : ''}>
                                <SelectTrigger className="w-[175px] bg-[#283444]  text-white  border-white  ">
                                    <SelectValue placeholder="رقم العضو" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
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
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="accusation">التهمة</label>
                            <Input name="accusation" onChange={handleChange} value={accus_ation} type="text" placeholder="التهمة" className="bg-[#273142] text-white w-full" />
                        </div>
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="defendantQuestion">سؤال المتهم</label>
                            <Select dir="rtl" value={defendant_Question} name="defendantQuestion" onValueChange={setDefendantQuestion}>
                                <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  ">
                                    <SelectValue placeholder="سؤال المتهم" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="officerQuestion">سؤال الضابط</label>
                            <Select dir="rtl" value={officer_Question} name="officerQuestion" onValueChange={setOfficerQuestion}>
                                <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  ">
                                    <SelectValue placeholder="سؤال المتهم" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="victimQuestion">سؤال المجني عليه</label>
                            <Select dir="rtl" value={victim_Question} name="victimQuestion" onValueChange={setVictimQuestion}>
                                <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  ">
                                    <SelectValue placeholder="سؤال المتهم" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="witnessQuestion">سؤال الشهود</label>
                            <Select dir="rtl" value={witness_Question} name="witnessQuestion" onValueChange={setWitnessQuestion}>
                                <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  ">
                                    <SelectValue placeholder="سؤال المتهم" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="technicalReports">التقارير الفنية</label>
                            <Select dir="rtl" value={technical_Reports} onValueChange={setTechnicalReports}>
                                <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  " >
                                    <SelectValue placeholder="اختيار الحالة" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <div className="flex flex-col space-y-5 space-x-4">
                            <label htmlFor="technicalReports">اجراءات اخرى</label>
                            <Select dir="rtl" value={action_Other} onValueChange={setActionOther}>
                                <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  " >
                                    <SelectValue placeholder="اختيار الحالة" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B2431]  text-white border-none">
                                    <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                    <SelectItem value="تم">تم</SelectItem>
                                    <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    <Button type="submit" variant="default" className="bg-[#4741DE] hover:bg-[#6A68FF] self-center min-w-56">حفظ التعديلات</Button>
                </form>
                <DialogFooter className="mt-4"></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalEditCase;
