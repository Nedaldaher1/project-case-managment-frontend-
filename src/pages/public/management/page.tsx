import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef
} from '@tanstack/react-table';
import ExcelJS from "exceljs";
import DialogEditCase from "@/components/case_management/dialogEditCasePublic";
import toast from 'react-hot-toast';

const Page = () => {
    interface Case {
        id: number;
        caseNumber: string;
        defendantName: string;
        imprisonmentDuration: number;
        startDate: string;
        caseID: string;
        issuingDepartment: string;
        member_number: string;
        type_case: string;
        year: string;
        investigationID: string;
        officeNumber: string;
    }

    const [data, setData] = useState<Case[]>([]);
    const [filteredData, setFilteredData] = useState<Case[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCases, setTotalCases] = useState(0);
    const [caseNumberFilter, setCaseNumberFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [renewalDate, setRenewalDate] = useState("");

    const getData = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases`, {
                params: { page, pageSize },
            });

            const { cases, total, totalPages } = response.data;
            setData(cases);
            setFilteredData(cases);
            setTotalPages(totalPages);
            setTotalCases(total);
            setError("");
        } catch (error) {
            setError("فشل في جلب البيانات");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData(currentPage);
    }, [currentPage, pageSize]);

    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(item => {
                const caseNumberMatch = item.caseNumber.toLowerCase().includes(caseNumberFilter.toLowerCase());
                let dateMatch = true;

                if (dateFilter) {
                    try {
                        const startDate = new Date(item.startDate);
                        const renewalDate = new Date(startDate);
                        renewalDate.setDate(startDate.getDate() + (item.imprisonmentDuration || 0) - 1);
                        dateMatch = renewalDate.toISOString().split('T')[0] === new Date(dateFilter).toISOString().split('T')[0];
                    } catch {
                        dateMatch = false;
                    }
                }

                return caseNumberMatch && dateMatch;
            });
            setFilteredData(filtered);
        };
        filterData();
    }, [caseNumberFilter, dateFilter, data]);

    const columns = useMemo<ColumnDef<Case>[]>(() => [
        { accessorKey: 'id', header: 'رقم مسلسل' },
        { accessorKey: 'caseNumber', header: 'رقم القضية' },
        { accessorKey: 'year', header: 'السنة' },
        { accessorKey: 'type_case', header: 'نوع القضية' },
        {
            accessorKey: 'investigationID', header: 'رقم حصر التحقيق'
        },
        { accessorKey: 'defendantName', header: 'اسم المتهم' },
        { accessorKey: 'member_number', header: 'رقم العضو' },
        {
            accessorKey: 'startDate',
            header: 'بداية المدة',
            cell: info => new Date(info.getValue() as string).toLocaleDateString('ar-EG')
        },
        { accessorKey: 'imprisonmentDuration', header: 'مدة الحبس' },
        {
            header: 'موعد التجديد',
            cell: info => {
                try {
                    const startDate = new Date(info.row.original.startDate);
                    const renewalDate = new Date(startDate);
                    renewalDate.setDate(startDate.getDate() + (info.row.original.imprisonmentDuration || 0) - 1);
                    setRenewalDate(renewalDate.toLocaleDateString('ar-EG'));
                    return renewalDate.toLocaleDateString('ar-EG');
                } catch {
                    return "تاريخ غير صحيح";
                }
            }
        },
        { accessorKey: 'issuingDepartment', header: 'دائرة اصدار القرار' },
        { accessorKey: 'officeNumber', header: 'رقم الدائرة' },

        {
            header: 'تعديل',
            cell: (info) => (
                <div className="flex justify-center items-center w-[50px]">
                    <DialogEditCase
                        id={Number(info.row.original.id)}
                        case_Number={info.row.original.caseNumber}
                        defendantName={info.row.original.defendantName}
                        imprisonmentDuration={info.row.original.imprisonmentDuration}
                        startDate={new Date(info.row.original.startDate)}
                        memberNumber={info.row.original.member_number}
                        type_case={info.row.original.type_case}
                        year={info.row.original.year}
                        issuingDepartment={info.row.original.issuingDepartment}
                        investigationID={info.row.original.investigationID}
                        officeNumber={info.row.original.officeNumber}
                    >
                        <img src={'/edit.svg'} width={24} height={24} alt="تعديل" />
                    </DialogEditCase>
                </div>
            )
        },

    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { pagination: { pageIndex: 0, pageSize } },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleExport = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("القضايا");
            
            // تنسيق الأعمدة بالعربية
            worksheet.columns = [
                { header: "رقم مسلسل", key: "id", width: 15 },
                { header: "رقم القضية", key: "caseNumber", width: 20 },
                { header: "السنة", key: "year", width: 20 },
                { header: "نوع القضية", key: "type_case", width: 20 },
                { header: "رقم حصر التحقيق", key: "investigationID", width: 20 },
                { header: "اسم المتهم", key: "defendantName", width: 20 },
                { header: "رقم العضو", key: "member_number", width: 15 },
                { header: "بداية المدة", key: "startDate", width: 20 },
                { header: "مدة الحبس", key: "imprisonmentDuration", width: 15 },
                { header: "موعد التجديد", key: "renewalDate", width: 20 },
                { header: "دائرة مصدر القرار", key: "issuingDepartment", width: 20 },
                { header: "رقم الدائرة", key: "officeNumber", width: 20 },
            ];
    
            // تنسيق رأس الجدول
            worksheet.getRow(1).font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2D9596' }
            };
    
            // معالجة البيانات
            filteredData.forEach(item => {
                const startDate = new Date(item.startDate);
                const renewalDate = new Date(startDate);
                
                // حساب موعد التجديد بدقة
                if (item.imprisonmentDuration) {
                    renewalDate.setDate(startDate.getDate() + parseInt(item.imprisonmentDuration.toString() || "0") - 1);
                }
    
                // تنسيق التواريخ الميلادية بالعربية
                const gregorianDateOptions = {
                    year: 'numeric' as const,
                    month: '2-digit' as const,
                    day: '2-digit' as const,
                    numberingSystem: 'arab' as const
                };
    
                worksheet.addRow({
                    ...item,
                    startDate: startDate.toLocaleDateString('ar-EG', gregorianDateOptions),
                    renewalDate: renewalDate.toLocaleDateString('ar-EG', gregorianDateOptions),
                });
            });
    
            // تطبيق التنسيق على كافة الصفوف
            worksheet.eachRow((row, rowNumber) => {
                row.alignment = { vertical: 'middle', horizontal: 'right' };
                if (rowNumber > 1) {
                    row.font = { name: 'Arial Arabic', size: 12 };
                }
            });
    
            // تصدير الملف
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
            });
            
            const fileName = `القضايا_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
    
        } catch (error) {
            console.error('فشل التصدير:', error);
            toast.error('فشل في تصدير الملف');
        }
    };

    return (
        <div dir="rtl" className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-6xl space-y-4">
                <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-lg shadow">
                    <div className="flex gap-4 flex-1">
                        <input
                            type="text"
                            placeholder="رقم القضية"
                            value={caseNumberFilter}
                            onChange={(e) => setCaseNumberFilter(e.target.value)}
                            className="border rounded-lg p-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="border rounded-lg p-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleExport}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>تصدير إلى أكسل</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center p-8">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                        <p className="mt-2 text-blue-600">جاري التحميل...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 p-4 rounded-lg text-red-700 text-center">
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <Table className="w-full">
                            <TableHeader className="bg-gray-50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead
                                                key={header.id}
                                                className="px-4 py-3 text-right font-semibold text-gray-700 border-b"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        className="hover:bg-gray-50 transition-colors even:bg-gray-50"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell
                                                key={cell.id}
                                                className="text-center p-3 border-t border-gray-100"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredData.length === 0 && !isLoading && (
                            <div className="p-6 text-center text-gray-500">
                                لا توجد بيانات متطابقة مع عوامل التصفية
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                        >
                            السابق
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                        >
                            التالي
                        </button>
                    </div>

                    <div className="text-gray-700">
                        الصفحة {currentPage} من {totalPages} (إجمالي القضايا: {totalCases})
                    </div>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1); // العودة إلى الصفحة الأولى عند تغيير حجم الصفحة
                        }}
                        className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10 لكل صفحة</option>
                        <option value={20}>20 لكل صفحة</option>
                        <option value={50}>50 لكل صفحة</option>
                        <option value={100}>100 لكل صفحة</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Page;