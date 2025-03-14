import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogEditCasePriavteProps } from "@/types/DialogEditCaseProps";
import { AnimatePresence, motion } from 'framer-motion';
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
    year?: number;
    caseType?: string;
    investigationID?: string;
    accusedName?: string;
    reportType?: string;    
}

const ModalEditCase = ({ children, caseID, caseNumber, accusation, defendantQuestion, officerQuestion, victimQuestion, witnessQuestion, technicalReports, caseReferral, isReadyForDecision, actionOther }: DialogEditCasePriavteProps) => {
    const [case_Number, setCaseNumber] = useState(caseNumber);
    const { userData } = useAuth();
    const [accusationOfCase, setAccusation] = useState(accusation);
    const [defendant_Question, setDefendantQuestion] = useState(defendantQuestion);
    const [officer_Question, setOfficerQuestion] = useState(officerQuestion);
    const [victim_Question, setVictimQuestion] = useState(victimQuestion);
    const [witness_Question, setWitnessQuestion] = useState(witnessQuestion);
    const [technical_Reports, setTechnicalReports] = useState(technicalReports);
    const [caseRe_ferral, setCaseReferral] = useState(caseReferral);
    const [year, setYear] = useState(0);
    const [caseType, setCaseType] = useState('');
    const [investigationID, setInvestigationID] = useState('');
    const [accusedName, setAccusedName] = useState('');
    const [isReadyFor_Decision, setIsReadyForDecision] = useState(isReadyForDecision);
    const [reportType, setReportType] = useState('');
    const [action_Other, setActionOther] = useState(actionOther);
    const [isOpen, setIsOpen] = useState(false);
    const member_number = userData?.member_id;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedFields: UpdatedCaseFields = { id: caseID.toString() };

        if (case_Number) updatedFields.caseNumber = case_Number;
        if (member_number) updatedFields.memberNumber = member_number.toString();
        if (accusationOfCase) updatedFields.accusation = accusationOfCase;
        if (year) updatedFields.year = year;
        if (caseType) updatedFields.caseType = caseType;
        if (investigationID) updatedFields.investigationID = investigationID;
        if (accusedName) updatedFields.accusedName = accusedName;

        if (defendant_Question) updatedFields.defendantQuestion = defendant_Question;
        if (officer_Question) updatedFields.officerQuestion = officer_Question;
        if (victim_Question) updatedFields.victimQuestion = victim_Question;
        if (witness_Question) updatedFields.witnessQuestion = witness_Question;
        if (technical_Reports) updatedFields.technicalReports = technical_Reports;
        if (reportType) updatedFields.reportType = reportType;
        if (caseRe_ferral) updatedFields.caseReferral = caseRe_ferral;
        if (action_Other) updatedFields.actionOther = action_Other;
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

 

    return (
        <AnimatePresence>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            >
                                <DialogHeader>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                                        تعديل بيانات القضية
                                    </h2>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* بيانات القضية */}
                                    <fieldset className="border-2 border-blue-100 rounded-xl p-6">
                                        <legend className="px-2 text-xl font-semibold text-blue-600">
                                            بيانات القضية
                                        </legend>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                            {/* رقم القضية */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">رقم القضية</label>
                                                <Input
                                                    type="text"
                                                    value={case_Number}
                                                    onChange={(e) => setCaseNumber(e.target.value)}
                                                     
                                                />
                                            </div>

                                            {/* السنة */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">السنة</label>
                                                <Input
                                                    type="number"
                                                    value={year}
                                                    onChange={(e) => setYear(Number(e.target.value))}
                                                     
                                                />
                                            </div>

                                            {/* نوع القضية */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">نوع القضية</label>
                                                <Select
                                                    value={caseType}
                                                    onValueChange={setCaseType}
                                                     
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

                                            {/* رقم حصر التحقيق */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">رقم حصر التحقيق</label>
                                                <Input
                                                    type="text"
                                                    value={investigationID}
                                                    onChange={(e) => setInvestigationID(e.target.value)}
                                                     
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700"> التهمة </label>
                                                <Input
                                                    type="text"
                                                    value={accusationOfCase}
                                                    onChange={(e) => setAccusation(e.target.value)}
                                                     
                                                />
                                            </div>

                                            {/* اسم المتهم */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">اسم المتهم</label>
                                                <Input
                                                    type="text"
                                                    value={accusedName}
                                                    onChange={(e) => setAccusedName(e.target.value)}
                                                />
                                            </div>

                                            {/* رقم العضو */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">رقم العضو</label>
                                                <Input
                                                    type="text"
                                                    value={member_number || ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* الإجراءات */}
                                    <fieldset className="border-2 border-blue-100 rounded-xl p-6">
                                        <legend className="px-2 text-xl font-semibold text-blue-600">
                                            الإجراءات
                                        </legend>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                                            {/* سؤال المتهم */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">سؤال المتهم</label>
                                                <Select
                                                    value={defendant_Question}
                                                    onValueChange={setDefendantQuestion}
                                                     
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر الحالة" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                                        <SelectItem value="تم">تم</SelectItem>
                                                        <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* سؤال المجني عليه */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">سؤال المجني عليه</label>
                                                <Select
                                                    value={victim_Question}
                                                    onValueChange={setVictimQuestion}
                                                     
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر الحالة" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                                        <SelectItem value="تم">تم</SelectItem>
                                                        <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* سؤال الشهود */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">سؤال الشهود</label>
                                                <Select
                                                    value={witness_Question}
                                                    onValueChange={setWitnessQuestion}
                                                     
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر الحالة" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                                        <SelectItem value="تم">تم</SelectItem>
                                                        <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">سؤال الظابط </label>
                                                <Select
                                                    value={officer_Question}
                                                    onValueChange={setOfficerQuestion}
                                                     
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر الحالة" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                                                        <SelectItem value="تم">تم</SelectItem>
                                                        <SelectItem value="حتى الآن">حتى الآن</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {/* تقارير فنية */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">تقارير فنية</label>
                                                <Select
                                                    value={technical_Reports}
                                                    onValueChange={setTechnicalReports}
                                                     
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

                                            {/* نوع التقرير (يظهر فقط إذا كانت التقارير الفنية "حتى الآن") */}
                                            {technical_Reports === 'حتى الآن' && (
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">نوع التقرير</label>

                                                    <Input
                                                        type="text"
                                                        value={reportType}
                                                        onChange={(e) => setReportType(e.target.value)}
                                                         required={technicalReports === 'حتى الآن'}
                                                    />

                                                </div>
                                            )}


                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">اجراءات اخرى</label>
                                                <Select
                                                    value={actionOther}
                                                    onValueChange={setActionOther}
                                                     
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
                                    </fieldset>
                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            variant="outline"
                                            className="px-6 py-2 border-gray-300"
                                        >
                                            إلغاء
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2"
                                        >
                                            حفظ التغييرات
                                        </Button>
                                    </div>
                                </form>

                            </motion.div>
                        </motion.div>

                    )}

                </AnimatePresence>

            </Dialog>
        </AnimatePresence>
    );
};

export default ModalEditCase;
