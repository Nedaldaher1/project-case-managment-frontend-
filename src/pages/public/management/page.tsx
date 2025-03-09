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

const Page = () => {
    interface Case {
        id: number;
        caseNumber: string;
        defendantName: string;
        imprisonmentDuration: number;
        startDate: string;
        caseID: string;
        member_location: string;
        member_number: string;
        type_case: string;
    }

    const [data, setData] = useState<Case[]>([]);
    const [filteredData, setFilteredData] = useState<Case[]>([]);
    const [pageSize] = useState(10);
    const [caseNumberFilter, setCaseNumberFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const getData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases`);
            const cases = response.data.cases || [];
            setData(cases);
            setFilteredData(cases);
            setError("");
        } catch (error) {
            setError("فشل في جلب البيانات");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

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
        { accessorKey: 'defendantName', header: 'اسم المتهم' },
        { accessorKey: 'imprisonmentDuration', header: 'مدة الحبس' },
        { 
            accessorKey: 'startDate', 
            header: 'بداية المدة', 
            cell: info => new Date(info.getValue() as string).toLocaleDateString('ar-EG')
        },
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
        { accessorKey: 'member_location', header: 'مكان التجديد' },
        { accessorKey: 'member_number', header: 'رقم العضو' },
        { accessorKey: 'type_case', header: 'نوع القضية' },
        { accessorKey: 'caseNumber', header: 'رقم القضية' },
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
                        member_Location={info.row.original.member_location}
                        memberNumber={info.row.original.member_number}
                        type_case={info.row.original.type_case}
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
            const worksheet = workbook.addWorksheet("Cases");
            worksheet.columns = [
                { header: "رقم مسلسل", key: "id", width: 15 },
                { header: "اسم المتهم", key: "defendantName", width: 20 },
                { header: "مدة الحبس", key: "imprisonmentDuration", width: 15 },
                { header: "بداية المدة", key: "startDate", width: 20 },
                { header: "موعد التجديد", key: "renewalDate", width: 20 },
                { header: "مكان التجديد", key: "member_location", width: 20 },
                { header: "رقم العضو", key: "member_number", width: 15 },
                { header: "نوع القضية", key: "type_case", width: 20 },
                { header: "رقم القضية", key: "caseNumber", width: 20 },
            ];

            filteredData.forEach(item => {
                const startDate = new Date(item.startDate);
                const renewalDate = new Date(startDate);
                renewalDate.setDate(startDate.getDate() + (item.imprisonmentDuration || 0) - 1);
                worksheet.addRow({
                    ...item,
                    startDate: startDate.toLocaleDateString("ar-EG"),
                    renewalDate: renewalDate.toLocaleDateString("ar-EG"),
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Cases.xlsx";
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            alert("فشل التصدير");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
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
                                                className="px-4 py-3 text-right border-b"
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
            </div>
        </div>
    );
};

export default Page;