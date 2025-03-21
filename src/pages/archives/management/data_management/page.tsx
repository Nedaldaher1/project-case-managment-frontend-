'use client';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    year: string;
    prosecutionDetentionDecision: string;
    finalCourtJudgment: string;
    statusEvidence: string;
    typeCaseTotalNumber: string;
    typeCaseNumber: string;
    // تأكد من وجود جميع الحقول المطلوبة
}

interface ApiResponse {
    success: boolean;
    prosecutionData: ProsecutionData[];
    total: number;
}

const PAGE_SIZE = 20;

const offices = [
    { id: "1", name: "النيابة الكلية" },
    { id: "2", name: "نيابة قسم اول المنصورة الجزئية" },
    { id: "3", name: "نيابة قسم ثاني المنصورة الجزئية" },
    { id: "4", name: "نيابة مركز المنصورة الجزئية" },
    { id: "5", name: "نيابة طلخا الجزئية" },
    { id: "6", name: "نيابة السنبلاوين الجزئية" },
    { id: "7", name: "نيابة اجا الجزئية" },
    { id: "8", name: "نيابة قسم ميت غمر الجزئية" },
    { id: "9", name: "نيابة تمي الامديد الجزئية" },
    { id: "10", name: "نيابة مركز ميت غمر الجزئية" }
];

const ProsecutionTable = () => {
    const [data, setData] = useState<ProsecutionData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    const [caseNumberSearch, setCaseNumberSearch] = useState('');
    const [itemNumberSearch, setItemNumberSearch] = useState('');
    const [debouncedCaseNumber, setDebouncedCaseNumber] = useState('');
    const [debouncedItemNumber, setDebouncedItemNumber] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<ProsecutionData | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCaseNumber(caseNumberSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [caseNumberSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedItemNumber(itemNumberSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [itemNumberSearch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedCaseNumber, debouncedItemNumber]);

    const fetchData = useCallback(async (page: number, caseNum: string, itemNum: string) => {
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
                    numberCase: caseNum,
                    itemNumber: itemNum
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

    useEffect(() => {
        fetchData(currentPage, debouncedCaseNumber, debouncedItemNumber);
    }, [currentPage, debouncedCaseNumber, debouncedItemNumber, fetchData]);

    const handleEdit = (data: ProsecutionData) => {
        setEditingData(data);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingData) return;

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_REACT_APP_API_URL}/archives/data/update/${editingData.id}`,
                editingData
            );

            if (response.data.success) {
                // التحقق من وجود البيانات المحدثة بشكل صحيح
                if (!response.data.updatedData) {
                    throw new Error('البيانات المحدثة غير موجودة');
                }

                // تحديث الحالة مع البيانات الجديدة
                setData(prev => prev.map(item =>
                    item.id === editingData.id ? response.data.updatedData : item
                ));

                setIsEditModalOpen(false);

                toast.success('تم التحديث بنجاح!', {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#4BB543',
                        color: '#fff',
                    }
                });

                // إعادة جلب البيانات للتأكد من المزامنة
                setTimeout(() => {
                    fetchData(currentPage, debouncedCaseNumber, debouncedItemNumber);
                }, 500);
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('فشل في التحديث: ' + (error as Error).message, {
                icon: '❌',
                style: {
                    borderRadius: '10px',
                    background: '#ff4444',
                    color: '#fff',
                }
            });
        }
    };

    const columns = useMemo<ColumnDef<ProsecutionData>[]>(() => [
        { accessorKey: 'serialNumber', header: 'المسلسل' },
        { accessorKey: 'itemNumber', header: 'رقم الأشياء' },
        { accessorKey: 'numberCase', header: 'رقم القضية' },
        { accessorKey: 'typeCaseNumber', header: 'نوع القضية ' },
        { accessorKey: 'year', header: 'السنة' },
        { accessorKey: 'charge', header: 'التهمة' },
        { accessorKey: 'seizureStatement', header: 'بيان الحرز' },
        { accessorKey: 'totalNumber', header: 'الرقم الكلي' },
        { accessorKey: 'typeCaseTotalNumber', header: 'نوع القضية ' },
        { accessorKey: 'roomNumber', header: 'رقم الغرفة' },
        { accessorKey: 'referenceNumber', header: 'رقم الاستاند' },
        { accessorKey: 'shelfNumber', header: 'رقم الرف' },
        { accessorKey: 'prosecutionDetentionDecision', header: 'قرار النيابة في الحرز' },
        { accessorKey: 'finalCourtJudgment', header: 'حكم المحكمة النهائي' },
        { accessorKey: 'statusEvidence', header: 'حالة الحرز' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(row.original)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                    تعديل
                </motion.button>
            ),
        },
    ], []);

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

    const clearFilters = () => {
        setCaseNumberSearch('');
        setItemNumberSearch('');
    };

    const exportToExcel = () => {
        if (data.length === 0) {
            toast.error('لا توجد بيانات للتصدير');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الحرز');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'بيانات_الحرز.xlsx');
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-4 text-blue-600"
            >
                جاري تحميل البيانات...
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-red-500 text-center p-4"
            >
                {error}
            </motion.div>
        );
    }

    return (
        <div className=" mx-auto p-4">
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-end">
                <motion.div
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    className="flex gap-3"
                >
                    <input
                        type="number"
                        placeholder="ابحث برقم القضية..."
                        className="p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                        value={caseNumberSearch}
                        onChange={(e) => setCaseNumberSearch(e.target.value)}
                        min={'0'}
                    />
                    <input
                        type="number"
                        placeholder="ابحث برقم الأشياء..."
                        className="p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                        value={itemNumberSearch}
                        onChange={(e) => setItemNumberSearch(e.target.value)}
                        min={'0'}

                    />
                </motion.div>

                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        🗑️ مسح التصنيفات
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                        📥 تصدير إلى Excel
                    </motion.button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-gray-200 shadow-lg bg-white overflow-x-auto"
            >
                <Table dir="rtl" className="min-w-full">
                    <TableHeader className="bg-blue-50">
                        <TableRow>
                            <TableCell className="text-center bg-blue-100 font-bold text-lg" colSpan={9}>
                                📁 بيانات الحرز
                            </TableCell>
                            <TableCell className="text-center bg-green-100 font-bold text-lg" colSpan={3}>
                                🚪 مكان تواجد الحرز
                            </TableCell>
                            <TableCell className="text-center bg-yellow-100 font-bold text-lg" colSpan={3}>
                                📝 التصرف في الاحراز
                            </TableCell>
                            <TableCell className="text-center bg-red-100 font-bold text-lg" colSpan={1}>
                                الإجراءات
                            </TableCell>
                        </TableRow>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className="hover:bg-blue-50">
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className="text-center p-3 font-semibold text-gray-700"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        <AnimatePresence>
                            {table.getRowModel().rows.map((row, index) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 even:bg-gray-50/30"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <motion.td
                                            key={cell.id}
                                            className="text-center p-3 border-t border-gray-100"
                                        >
                                            <div className="px-2 py-1 rounded-md bg-white shadow-sm">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </motion.td>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </motion.div>

            <div className="flex items-center justify-end gap-4 mt-6">
                <motion.button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    ← السابق
                </motion.button>

                <span className="text-gray-600 font-medium">
                    الصفحة {currentPage} من {Math.ceil(totalCount / PAGE_SIZE)}
                </span>

                <motion.button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * PAGE_SIZE >= totalCount}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    التالي →
                </motion.button>
            </div>

            {/* مودال التعديل */}
            <AnimatePresence>
                {isEditModalOpen && editingData && (
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
                            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                                تعديل بيانات الحرز
                            </h2>

                            <form onSubmit={handleUpdate} className="space-y-8">
                                {/* قسم بيانات الحرز */}
                                <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                                    <legend className="px-2 text-xl font-semibold text-blue-600">
                                        بيانات الحرز
                                    </legend>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">


                                        {/* المسلسل */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                المسلسل
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingData.serialNumber}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, serialNumber: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* رقم الأشياء */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                رقم الأشياء
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingData.itemNumber}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, itemNumber: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* رقم القضية */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                رقم القضية
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingData.numberCase}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, numberCase: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* نوع القضية لرقم القضية */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                نوع القضية لرقم القضية
                                            </label>
                                            <Select
                                                value={editingData.typeCaseNumber || ""}
                                                onValueChange={value => setEditingData(prev =>
                                                    prev ? { ...prev, typeCaseNumber: value } : null
                                                )}
                                            >
                                                <SelectTrigger className="w-full border-blue-200 rounded-xl">
                                                    <SelectValue placeholder="اختر نوع القضية" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="جنح">جنح</SelectItem>
                                                    <SelectItem value="جناية">جناية</SelectItem>
                                                    <SelectItem value="اداري">اداري</SelectItem>
                                                    <SelectItem value="اقتصادية">اقتصادية</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* السنة */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                السنة
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.year}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, year: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* التهمة */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                التهمة
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.charge}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, charge: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* بيان الحرز */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                بيان الحرز
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.seizureStatement}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, seizureStatement: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* الرقم الكلي */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                الرقم الكلي
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.totalNumber}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, totalNumber: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* نوع القضية لرقم الكلي */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                نوع القضية لرقم الكلي
                                            </label>
                                            <Select
                                                value={editingData.typeCaseTotalNumber || ""}
                                                onValueChange={value => setEditingData(prev =>
                                                    prev ? { ...prev, typeCaseTotalNumber: value } : null
                                                )}
                                            >
                                                <SelectTrigger className="w-full border-blue-200 rounded-xl">
                                                    <SelectValue placeholder="اختر نوع القضية" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="جنح">جنح</SelectItem>
                                                    <SelectItem value="جناية">جناية</SelectItem>
                                                    <SelectItem value="اداري">اداري</SelectItem>
                                                    <SelectItem value="اقتصادية">اقتصادية</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* قسم مكان تواجد الحرز */}
                                <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                                    <legend className="px-2 text-xl font-semibold text-blue-600">
                                        مكان تواجد الحرز
                                    </legend>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                        {/* رقم الغرفة */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                رقم الغرفة
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingData.roomNumber}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, roomNumber: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* رقم الاستاند */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                رقم الاستاند
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingData.referenceNumber}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, referenceNumber: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* رقم الرف */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                رقم الرف
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingData.shelfNumber}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, shelfNumber: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* قسم التصرف في الحرز */}
                                <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                                    <legend className="px-2 text-xl font-semibold text-blue-600">
                                        التصرف في الحرز
                                    </legend>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                        {/* قرار النيابة */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                قرار النيابة
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.prosecutionDetentionDecision}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, prosecutionDetentionDecision: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* حكم المحكمة النهائي */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                حكم المحكمة النهائي
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.finalCourtJudgment}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, finalCourtJudgment: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* حالة الحرز */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 text-right">
                                                حالة الحرز
                                            </label>
                                            <Select
                                                value={editingData.statusEvidence}
                                                onValueChange={value => setEditingData(prev =>
                                                    prev ? { ...prev, statusEvidence: value } : null
                                                )}
                                            >
                                                <SelectTrigger className="w-full border-blue-200 rounded-xl">
                                                    <SelectValue placeholder="اختر حالة الحرز" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value=" على ذمة التحقيق"> على ذمة التحقيق </SelectItem>
                                                    <SelectItem value="جاهز للتسليم">جاهز للتسليم</SelectItem>
                                                    <SelectItem value="جاهز للبيع">جاهز للبيع</SelectItem>
                                                    <SelectItem value="جاهز للاعدام">جاهز للإعدام</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* أزرار الإجراءات */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        variant="outline"
                                        className="px-6 py-2"
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
        </div>
    );
};

export default ProsecutionTable;