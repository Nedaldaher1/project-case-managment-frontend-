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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Trash, Edit } from "lucide-react"
import Cookies from "js-cookie";
interface User {
    id: string;
    member_id: string;
    username: string;
    password: string;
    role: string;
}
import { toast } from "react-hot-toast";
import { deleteUserById } from "@/api/authApi";
import DialogEditUser from '@/components/user_management/dialogEditUser'
const Page = () => {

    const [data, setData] = useState<User[]>([]);
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [roleFilter, setRoleFilter] = useState("");
    const username = Cookies.get('username');


    const getData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/users`);
            setData(response.data.users || []);
            setFilteredData(response.data.users || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();

    }, []);

    // Filter data in real-time based on case number and date filter
    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(item => {
                // filter based on role
                const roleMatch = item.role.includes(roleFilter);
                return roleMatch;
            });
            setFilteredData(filtered);
        };
        filterData();
    }, [roleFilter, data]);

    console.log(filteredData);

    // Define columns with useMemo
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { accessorKey: 'id', header: 'رقم المتسلسل' },
            { accessorKey: 'member_id', header: 'رقم العضو' },
            { accessorKey: 'username', header: 'اسم المستخدم' },
            { accessorKey: 'password', header: 'كلمة المرور' },
            { accessorKey: 'role', header: 'الرتبة' },
            {
                header: 'تعديل', cell: ({ row }) => {
                    return (
                        <div className="flex flex-row  justify-center items-center">
                            <DialogEditUser id={row.original.id} roleUser={row.original.role} userNamePass={row.original.username}>
                                <Edit className="cursor-pointer" size={24} />
                            </DialogEditUser>
                            <Trash className=" text-red-500 cursor-pointer" onClick={() => {

                                if (username === row.original.username) {
                                    toast.error("لا يمكن حذف حسابك الخاص")
                                } else {
                                    deleteUserById(row.original.id)
                                    toast.success("تم حذف المستخدم بنجاح")
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
                {/* Filter Section */}
                <div className="flex items-center self-end space-x-4 mb-4">
                    <Select dir="rtl" name="role" onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[175px] bg-[#283444] text-white  border-white  ">
                            <SelectValue placeholder="اختيار الرتبة" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1B2431]  text-white border-none">
                            <SelectItem value="onwer">الرئيس</SelectItem>
                            <SelectItem value="admin">المدير</SelectItem>
                            <SelectItem value="editor">المحرر</SelectItem>
                            <SelectItem value="viewer">مشاهد</SelectItem>
                        </SelectContent>
                    </Select>
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