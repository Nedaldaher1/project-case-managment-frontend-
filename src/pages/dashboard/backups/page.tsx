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
import { Trash, Hand } from "lucide-react"
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteBackup , restoreBackup } from '@/api/authApi'

interface Backup {
    id: string;
    backupName: string;
    backupDate: string;
    backupSize: string;
    backupType: string;
    backupStatus: string;

}
const Page = () => {

    const [data, setData] = useState<Backup[]>([]);
    const [filteredData, setFilteredData] = useState<Backup[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [dateFilter, setDateFilter] = useState("");
    const username = Cookies.get('username');


    const getData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/backup/get`);
            setData(response.data.getBackup || []);
            setFilteredData(response.data.getBackup || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        getData();

    }, []);
    console.log(data);

    // Filter data in real-time based on case number and date filter
    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(item => {
                const dateMatch = item.backupDate.includes(dateFilter);
                return dateMatch;
            });
            setFilteredData(filtered);
        };
        filterData();
    }, [data, dateFilter]);


    // Define columns with useMemo
    const columns = useMemo<ColumnDef<Backup>[]>(
        () => [
            { accessorKey: 'id', header: 'رقم المتسلسل' },
            { accessorKey: 'backupName', header: 'اسم النسخة' },
            { accessorKey: 'backupDate', header: 'تاريخ النسخة', cell: ({ row }) => new Date(row.original.backupDate).toLocaleDateString() },
            { accessorKey: 'backupSize', header: 'حجم النسخة' },
            { accessorKey: 'backupType', header: 'نوع النسخة' },
            { accessorKey: 'backupStatus', header: 'حالة النسخة' },
            {
                header: 'تعديل', cell: ({ row }) => {
                    return (
                        <div className="flex flex-row  justify-center items-center">
                            <Trash className=" text-red-500 cursor-pointer" onClick={async () => {
                                const response = await deleteBackup(row.original.id);
                                if (response) {
                                    toast.success("تم حذف النسخة بنجاح");
                                    getData();
                                }
                            }} size={24} />
                            <Hand className=" text-green-500 cursor-pointer" onClick={async() => {
                                    const response = await restoreBackup(row.original.id);
                                    if (response) {
                                        toast.success("تم استعادة النسخة بنجاح");
                                        getData();
                                    }
                                
                            }} size={24} />
                        </div>
                    )
                }
            },
        ],
        []
    );

    // Set up the table with pagination and filtering
    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            pagination: { pageIndex: 0, pageSize },
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Pagination Controls
    const handleNextPage = () => table.nextPage();
    const handlePreviousPage = () => table.previousPage();

    return (
        <div className="flex flex-col items-center h-[110vh] space-y-4">
            <div className="flex flex-col items-center justify-center">

                <div className="flex items-center self-end space-x-4 mb-4">
                    <Input value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} type="date" placeholder="أبحث" />
                    <Button onClick={() => {
                        setFilteredData([])
                        setData([])
                    }}>
                        مسح الفلترة
                    </Button>
                </div>

                {/* Table Section */}
                <div className="w-[1110px]">
                    <Table className=" overflow-hidden">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id} className="text-center">
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id} className="text-center">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>


                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="text-center align-middle truncate max-w-[150px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>

                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>

                        </TableFooter>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex space-x-2">
                    <button onClick={handlePreviousPage} disabled={!table.getCanPreviousPage()} className="border rounded p-2">
                        السابق
                    </button>
                    {table.getPageOptions().map((pageIndex) => (
                        <button
                            key={pageIndex}
                            onClick={() => table.setPageIndex(pageIndex)}
                            className={`border rounded p-2 ${table.getState().pagination.pageIndex === pageIndex ? 'bg-purple-500 text-white' : ''}`}
                        >
                            {pageIndex + 1}
                        </button>
                    ))}
                    <button onClick={handleNextPage} disabled={!table.getCanNextPage()} className="border rounded p-2">
                        التالي
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;