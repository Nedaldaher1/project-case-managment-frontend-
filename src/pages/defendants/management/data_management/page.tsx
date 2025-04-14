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
import { useAuth } from '@/context/userContext';
import { useSearchParams } from "react-router-dom";
import { useAbility } from '@casl/react';
import { AbilityContext } from '@/context/AbilityContext';
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from 'react-redux';


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
    const [searchParams] = useSearchParams();
    const ability = useAbility(AbilityContext);
    const type = searchParams.get('type');
    const { token, userData } = useAuth();
    const usernameParams = userData?.username;
    const isDarkMode = useSelector(selectDarkMode);


    const fetchData = async (pageNumber: number = 1, pageSizeParam: number = 10) => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases/${usernameParams}`, {
                    params: { page: pageNumber, pageSize: pageSizeParam, type },
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    }
                });

            const { total, totalPages } = response.data.pagination;
            setData(response.data.data);
            setFilteredData(response.data.data);
            setTotalPages(totalPages);
            setTotalCases(total);
            setError("");
            console.log(response.data);
        } catch (error) {
            setError((error as any).response.data.error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllData = async (page: number = 1, pageSize: number = 10) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases`, {
                params: { page, pageSize, type },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });

            const { cases, total, totalPages } = response.data;
            setData(cases);
            setFilteredData(cases);
            setTotalPages(totalPages);
            setTotalCases(total);
            setError("");
        } catch (error) {
            setError((error as any).response.data.error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!ability.can('view', 'CaseSystem')) {
            fetchAllData(currentPage, pageSize);
        }
        fetchData(currentPage, pageSize);


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
        { accessorKey: 'defendantNameAnother', header: 'اسم المتهم الثاني' },
        { accessorKey: 'username', header: 'اسم المستخدم' },
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



    const handleExportFull = async () => {
        try {

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases/all/full`, {
                params: {
                    type,
                },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });
            const data: Case[] = res.data.data;
            // if (data.length === 0) {
            //     toast.error('لا توجد بيانات للتصدير');
            //     return;
            // }

            console.log(data);

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
                { header: "اسم المتهم الثاني", key: "defendantNameAnother", width: 20 },
                { header: "اسم المستخدم", key: "username", width: 20 },
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
            data.forEach(item => {
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
        <div dir="rtl" className={`flex flex-col items-center min-h-screen p-4 ${
            isDarkMode ? 'bg-[#111827]' : 'bg-gray-50'
        }`}>
            <div className="w-full max-w-6xl space-y-4">
                <div className={`flex flex-wrap gap-4 justify-between items-center p-4 rounded-lg shadow ${
                    isDarkMode 
                    ? 'bg-[#1F2937] border-[#374151]' 
                    : 'bg-white'
                }`}>
                    <div className="flex gap-4 flex-1">
                        <input
                            type="text"
                            placeholder="رقم القضية"
                            value={caseNumberFilter}
                            onChange={(e) => setCaseNumberFilter(e.target.value)}
                            className={`border rounded-lg p-2 w-full max-w-xs focus:ring-2 ${
                                isDarkMode
                                ? 'bg-[#1F2937] border-[#374151] text-[#E5E7EB] focus:ring-[#818CF8]'
                                : 'border-gray-200 focus:ring-blue-500'
                            }`}
                        />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className={`border rounded-lg p-2 w-full max-w-xs focus:ring-2 ${
                                isDarkMode
                                ? 'bg-[#1F2937] border-[#374151] text-[#E5E7EB] focus:ring-[#818CF8]'
                                : 'border-gray-200 focus:ring-blue-500'
                            }`}
                        />
                    </div>

                    <button
                        onClick={handleExportFull}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            isDarkMode
                            ? 'bg-[#4F46E5] hover:bg-[#2563EB] text-[#E5E7EB]'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                        📥 تصدير الكل Excel
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center p-8">
                        <div className={`animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent ${
                            isDarkMode ? 'border-[#818CF8]' : 'border-blue-500'
                        }`}></div>
                        <p className={`mt-2 ${isDarkMode ? 'text-[#93C5FD]' : 'text-blue-600'}`}>
                            جاري التحميل...
                        </p>
                    </div>
                )}

                {error && (
                    <div className={`p-4 rounded-lg text-center ${
                        isDarkMode 
                        ? 'bg-red-900/20 text-red-300' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <div className={`rounded-lg shadow overflow-hidden ${
                        isDarkMode ? 'bg-[#1F2937]' : 'bg-white'
                    }`}>
                        <Table className="w-full">
                            <TableHeader className={isDarkMode ? 'bg-[#374151]' : 'bg-gray-50'}>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead
                                                key={header.id}
                                                className={`px-4 py-3 text-right font-semibold border-b ${
                                                    isDarkMode
                                                    ? 'text-[#E5E7EB] border-[#374151]'
                                                    : 'text-gray-700 border-gray-200'
                                                }`}
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
                                        className={`${
                                            isDarkMode
                                            ? 'hover:bg-[#374151] even:bg-[#1F2937]/30'
                                            : 'hover:bg-gray-50 even:bg-gray-50'
                                        }`}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell
                                                key={cell.id}
                                                className={`text-center p-3 border-t ${
                                                    isDarkMode 
                                                    ? 'border-[#374151] text-[#E5E7EB]' 
                                                    : 'border-gray-100'
                                                }`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredData.length === 0 && !isLoading && (
                            <div className={`p-6 text-center ${
                                isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'
                            }`}>
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
                            className={`px-4 py-2 rounded-lg ${
                                isDarkMode
                                ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#E5E7EB] disabled:bg-[#374151]'
                                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'
                            }`}
                        >
                            السابق
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg ${
                                isDarkMode
                                ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#E5E7EB] disabled:bg-[#374151]'
                                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'
                            }`}
                        >
                            التالي
                        </button>
                    </div>

                    <div className={`${isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-700'}`}>
                        الصفحة {currentPage} من {totalPages} (إجمالي القضايا: {totalCases})
                    </div>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className={`border rounded-lg p-2 focus:ring-2 ${
                            isDarkMode
                            ? 'bg-[#1F2937] border-[#374151] text-[#E5E7EB] focus:ring-[#818CF8]'
                            : 'border-gray-200 focus:ring-blue-500'
                        }`}
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