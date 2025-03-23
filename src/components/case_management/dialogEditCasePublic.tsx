import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogEditCasePublicProps } from "@/types/DialogEditCaseProps";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/context/userContext';
import { AnimatePresence, motion } from 'framer-motion';
// تعريف نوع UpdatedCaseFields
interface UpdatedCaseFields {
  id: number;
  caseNumber?: string;
  defendantName?: string;
  startDate?: Date;
  imprisonmentDuration?: number;
  issuingDepartment?: string;
  member_number?: string;
  type_case?: string;
  year?: string;
  investigationID?: string;
  officeNumber?: string;
}

const ModalEditCase = ({ children, id, type_case, defendantName, imprisonmentDuration, startDate, issuingDepartment, case_Number, year, investigationID, officeNumber }: DialogEditCasePublicProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caseNumber, setCaseNumber] = useState(case_Number);
  const [accusedName, setAccusedName] = useState(defendantName);
  const [caseDate, setCaseDate] = useState<Date | null>(startDate ? new Date(startDate) : null);
  const [casePrisonDate, setCasePrisonDate] = useState<number | undefined>(imprisonmentDuration ? parseInt(imprisonmentDuration.toString()) : undefined);
  const [issuingDepartmentOfCase, setIssuingDepartment] = useState(issuingDepartment);
  const [yearOfCase, setYear] = useState(year);
  const [investigationIDOfCase, setInvestigationID] = useState(investigationID);
  const [caseType, setcaseType] = useState(type_case);
  const [officeNumberOfCase, setOfficeNumber] = useState(officeNumber);
  const { userData,token } = useAuth();
  const member_number = userData?.member_id;

  const arabicNumbers: { [key: number]: string } = {
    1: 'الأولى',
    2: 'الثانية',
    3: 'الثالثة',
    4: 'الرابعة',
    5: 'الخامسة',
    6: 'السادسة',
    7: 'السابعة',
    8: 'الثامنة',
    9: 'التاسعة',
    10: 'العاشرة',
    11: 'الحادية عشرة',
    12: 'الثانية عشرة',
    13: 'الثالثة عشرة',
    14: 'الرابعة عشرة',
    15: 'الخامسة عشرة',
    16: 'السادسة عشرة',
    17: 'السابعة عشرة',
    18: 'الثامنة عشرة',
    19: 'التاسعة عشرة',
    20: 'العشرون',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFields: UpdatedCaseFields = { id, year: new Date().getFullYear().toString() }; // استخدام النوع المخصص

    if (caseNumber) updatedFields.caseNumber = caseNumber;
    if (accusedName) updatedFields.defendantName = accusedName;
    if (caseDate) updatedFields.startDate = caseDate;
    if (casePrisonDate) updatedFields.imprisonmentDuration = casePrisonDate;
    if (issuingDepartmentOfCase) updatedFields.issuingDepartment = issuingDepartmentOfCase;
    if (caseType) updatedFields.type_case = caseType;
    if (investigationIDOfCase) updatedFields.investigationID = investigationIDOfCase;
    if (yearOfCase) updatedFields.year = yearOfCase;
    if (officeNumberOfCase) updatedFields.officeNumber = officeNumberOfCase;
    if (member_number) {
      updatedFields.member_number = member_number.toString();
    }

    if (Object.keys(updatedFields).length > 1) { // Check if at least one field is filled
      try {
        if (!import.meta.env.VITE_REACT_APP_API_URL) {
          throw new Error('API URL is not defined');
        }
        const res = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases/edit`, updatedFields,{
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
        }
        });
        toast.success('تم التحديث بنجاح!');
      } catch (error) {
        toast.error('فشلت عملية التحديث');
        console.error('Error updating case:', error);
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
                  {/* بيانات القضية الأساسية */}
                  <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                    <legend className="px-2 text-xl font-semibold text-blue-600">
                      بيانات القضية
                    </legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-right">
                          رقم القضية
                        </label>
                        <Input
                          value={caseNumber}
                          name="caseNumber"
                          onChange={(e) => setCaseNumber(e.target.value)}
                          className="w-full border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700"> السنة</label>
                        <Input
                          type="number"
                          value={yearOfCase}
                          onChange={(e) => setYear(e.target.value)}
                          className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-right">
                          نوع القضية
                        </label>
                        <Select
                          value={caseType}
                          onValueChange={(value) => setcaseType(value)}
                        >
                          <SelectTrigger className="w-full border-blue-200 rounded-xl bg-white">
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="جنحة">جنحة</SelectItem>
                            <SelectItem value="جناية">جناية</SelectItem>
                            <SelectItem value="اداري">اداري</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">رقم حصر التحقيق</label>
                        <Input
                          type="text"
                          value={investigationIDOfCase}
                          onChange={(e) => setInvestigationID(e.target.value)}
                          className="border-blue-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-right">
                          اسم المتهم
                        </label>
                        <Input
                          value={accusedName}
                          name="accusedName"
                          onChange={(e) => setAccusedName(e.target.value)}
                          className="w-full border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-right">
                          رقم العضو
                        </label>
                        <Select value={member_number?.toString()} disabled>
                          <SelectTrigger className="w-full border-blue-200 rounded-xl bg-white">
                            <SelectValue placeholder="رقم العضو" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(10)].map((_, i) => (
                              <SelectItem key={i + 1} value={`${i + 1}`}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>






                    </div>
                  </fieldset>

                  {/* معلومات العضو والموقع */}
                  <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                    <legend className="px-2 text-xl font-semibold text-blue-600">
                      معلومات التجديد
                    </legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-right">
                          تاريخ البداية
                        </label>
                        <Input
                          type="date"
                          value={caseDate ? caseDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => setCaseDate(new Date(e.target.value))}
                          className="w-full border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-right">
                          مدة الحبس (أيام)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={casePrisonDate}
                          onChange={(e) => setCasePrisonDate(parseInt(e.target.value))}
                          className="w-full border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">دائرة مصدرة القرار</label>
                        <Select
                          value={issuingDepartment}
                          onValueChange={setIssuingDepartment}
                        >
                          <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                            <SelectValue placeholder="اختر الدائرة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="جزئي">جزئي</SelectItem>
                            <SelectItem value="مستأنف">مستأنف</SelectItem>
                            <SelectItem value="جنايات">جنايات</SelectItem>
                            <SelectItem value="رئيس نيابة">رئيس نيابة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">رقم الدائرة</label>
                        <Select
                          value={officeNumber}
                          onValueChange={setOfficeNumber}
                        >
                          <SelectTrigger className="border-blue-200 focus:ring-2 focus:ring-indigo-500">
                            <SelectValue placeholder="اختر الرقم" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={arabicNumbers[num]}>
                                {arabicNumbers[num]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                    </div>


                  </fieldset>


                  {/* أزرار الإجراءات */}
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