'use client';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef
} from '@tanstack/react-table';

interface ProsecutionData {
    id: string;
    serialNumber: string;
    itemNumber: string;
    charge: string;
    seizureStatement: string;
    disposalOfSeizure: string;
    totalNumber: string;
    roomNumber: string;
    referenceNumber: string;
    shelfNumber: string;
    prosecutionOfficeId: string;
    numberCase: string;
}

interface ApiResponse {
    success: boolean;
    prosecutionData: ProsecutionData[];
    total: number;
}

const PAGE_SIZE = 20;

const ProsecutionTable = () => {
    const [data, setData] = useState<ProsecutionData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // إدارة إدخال البحث مع تأخير
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // إعادة تعيين الصفحة إلى 1 عند تغيير البحث
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery]);

    // دالة جلب البيانات
    const fetchData = useCallback(async (page: number, query: string) => {
        setIsLoading(true);
        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_REACT_APP_API_URL}/archives/data/all`, {
                params: {
                    type,
                    page,
                    limit: PAGE_SIZE,
                    search: query
                }
            });

            if (response.data.success) {
                setData(response.data.prosecutionData);
                setTotalCount(response.data.total);
            } else {
                setError('البيانات غير متوفرة');
            }
        } catch (err) {
            setError('حدث خطأ أثناء جلب البيانات');
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    // طلب البيانات عند تغيير الصفحة أو البحث
    useEffect(() => {
        fetchData(currentPage, debouncedSearchQuery);
    }, [currentPage, debouncedSearchQuery, fetchData]);

    // تعريف الأعمدة
    const columns = useMemo<ColumnDef<ProsecutionData>[]>(() => [
        { accessorKey: 'serialNumber', header: 'المسلسل' },
        { accessorKey: 'itemNumber', header: ' رقم الاشيا' },
        { accessorKey: 'numberCase', header: 'رقم القضية' },
        { accessorKey: 'charge', header: 'التهمة' },
        { accessorKey: 'totalNumber', header: 'الرقم الكلي' },
        { accessorKey: 'seizureStatement', header: 'بيان الحرز' },
        { accessorKey: 'roomNumber', header: 'رقم الغرفة' },
        { accessorKey: 'referenceNumber', header: 'رقم الستاند' },
        { accessorKey: 'shelfNumber', header: 'رقم الرف' },
        { accessorKey: 'prosecutionDetentionDecision', header: ' قرار النيابة في الحرز ' },
        { accessorKey: 'finalCourtJudgment', header: 'حكم المحكمة النهائي' },

    ], []);

    // تكوين الجدول
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalCount / PAGE_SIZE),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: PAGE_SIZE
            }
        }
    });

    // مسح الفلاتر
    const clearFilters = () => {
        setSearchQuery('');
    };

    // عرض حالات التحميل والخطأ
    if (isLoading) {
        return <div className="text-center p-4">جاري تحميل البيانات...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-4 mb-4 items-center justify-end">
                <input
                    type="text"
                    placeholder="ابحث برقم القضية أو التهمة..."
                    className="p-2 border rounded w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    مسح التصنيفات
                </button>
            </div>

            <div className="rounded-lg border shadow overflow-hidden">
                <Table dir="rtl">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableCell className="text-center bg-blue-100 font-bold" colSpan={6}>
                                بيانات الحرز
                            </TableCell>
                            <TableCell className="text-center bg-green-100 font-bold" colSpan={4}>
                                مكان تواجد الحرز
                            </TableCell>
                            <TableCell className="text-center bg-yellow-100 font-bold" colSpan={2}>
                                التصرف في الحرز
                            </TableCell>
                        </TableRow>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="text-center p-3">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} className="text-center p-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end gap-4 mt-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    السابق
                </button>
                <span className="text-gray-600">
                    الصفحة {currentPage} من {Math.ceil(totalCount / PAGE_SIZE)}
                </span>
                <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * PAGE_SIZE >= totalCount}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    التالي
                </button>
            </div>
        </div>
    );
};

export default ProsecutionTable;