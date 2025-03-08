import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableFooter,
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
    const [pageSize, setPageSize] = useState(10);
    const [caseNumberFilter, setCaseNumberFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const getData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/public/cases`);
            console.log("API Response:", response.data);
            
            const cases = response.data.cases || [];
            console.log("Processed Cases:", cases);
            
            setData(cases);
            setFilteredData(cases);
            setError("");
        } catch (error) {
            console.error("Error fetching data:", error);
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
            console.log("Filtering with:", { caseNumberFilter, dateFilter });
            
            const filtered = data.filter(item => {
                // Case Number Filter
                const caseNumberMatch = item.caseNumber.toLowerCase().includes(caseNumberFilter.toLowerCase());
                
                // Date Filter
                let dateMatch = true;
                if (dateFilter) {
                    try {
                        const startDate = new Date(item.startDate);
                        const renewalDate = new Date(startDate);
                        renewalDate.setDate(startDate.getDate() + (item.imprisonmentDuration || 0) - 1);
                        
                        const renewalDateString = renewalDate.toISOString().split('T')[0];
                        const filterDate = new Date(dateFilter).toISOString().split('T')[0];
                        
                        dateMatch = renewalDateString === filterDate;
                    } catch (e) {
                        console.error("Invalid date processing:", e);
                        dateMatch = false;
                    }
                }

                return caseNumberMatch && dateMatch;
            });

            console.log("Filtered Results:", filtered);
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
            cell: info => {
                const value = info.getValue() as string;
                console.log("startDate value:", value);
                return new Date(value).toLocaleDateString('ar-EG');
            }
        },
        {
            header: 'موعد التجديد',
            cell: info => {
                try {
                    const startDate = new Date(info.row.original.startDate);
                    const imprisonmentDuration = info.row.original.imprisonmentDuration || 0;
                    const renewalDate = new Date(startDate);
                    renewalDate.setDate(startDate.getDate() + imprisonmentDuration - 1);
                    return renewalDate.toLocaleDateString('ar-EG');
                } catch (e) {
                    console.error("Error calculating renewal date:", e);
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
                        <img src={'/edit.svg'} width={24} height={24} alt="" />
                    </DialogEditCase>
                </div>
            )
        },
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            pagination: { pageIndex: 0, pageSize },
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    console.log("Table State:", {
        rows: table.getRowModel().rows,
        columns: table.getAllColumns(),
        filteredData
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
                try {
                    const startDate = new Date(item.startDate);
                    const renewalDate = new Date(startDate);
                    renewalDate.setDate(startDate.getDate() + (item.imprisonmentDuration || 0) - 1);

                    worksheet.addRow({
                        ...item,
                        startDate: startDate.toLocaleDateString("ar-EG"),
                        renewalDate: renewalDate.toLocaleDateString("ar-EG"),
                    });
                } catch (e) {
                    console.error("Error exporting row:", item, e);
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "Cases.xlsx";
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("فشل التصدير");
        }
    };

    return (
        <div className="flex flex-col items-center h-[110vh] space-y-4">
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center self-end space-x-4 mb-4">
                    <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded">
                        تصدير إلى أكسل
                    </button>
                    <input
                        type="text"
                        placeholder="رقم القضية"
                        value={caseNumberFilter}
                        onChange={(e) => setCaseNumberFilter(e.target.value)}
                        className="border rounded p-2"
                    />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>

                {isLoading && <p className="text-blue-500">جاري التحميل...</p>}
                {error && <p className="text-red-500">{error}</p>}
                
                {!isLoading && !error && (
                    <div className="w-[1110px]">
                        <Table className="overflow-hidden">
                            <TableHeader>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map(row => {
                                    console.log("Rendering row:", row.original);
                                    return (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => {
                                                const value = cell.getValue();
                                                console.log(`Cell [${cell.id}]:`, value);
                                                return (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {filteredData.length === 0 && !isLoading && (
                            <p className="text-center my-4">لا توجد بيانات متطابقة مع عوامل التصفية</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;