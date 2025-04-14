'use client';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import InputStatusEvidence from "@/components/archives/inputStatusEvidence";
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
import ExcelJS from "exceljs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/userContext";

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
}

interface ApiResponse {
    success: boolean;
    prosecutionData: ProsecutionData[];
    total: number;
}




const ProsecutionTable = () => {
    const [data, setData] = useState<ProsecutionData[]>([]);
    console.log('data', data);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [statusEvidence, setStatusEvidence] = useState('');

    const [caseNumberSearch, setCaseNumberSearch] = useState('');
    const [itemNumberSearch, setItemNumberSearch] = useState('');
    const [year, setYear] = useState('');
    const [debouncedCaseNumber, setDebouncedCaseNumber] = useState('');
    const [debouncedItemNumber, setDebouncedItemNumber] = useState('');
    const [debouncedYear, setDebouncedYear] = useState(null as string | null);
    const [actionType, setActionType] = useState('action-taken');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<ProsecutionData | null>(null);
    const isDarkMode = useSelector(selectDarkMode);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCaseNumber(caseNumberSearch);
        }, 1000);
        return () => clearTimeout(timer);
    }, [caseNumberSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedItemNumber(itemNumberSearch);
        }, 1000);
        return () => clearTimeout(timer);
    }, [itemNumberSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedYear(year);
        }, 1000);
        return () => clearTimeout(timer);
    }, [year]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedCaseNumber, debouncedItemNumber, debouncedYear, actionType, totalPages]);

    const fetchData = useCallback(async (page: number, caseNum: string, itemNum: string, year: string, statusEvidence: string) => {
        setIsLoading(true);
        try {
            if (!import.meta.env.VITE_REACT_APP_API_URL) {
                throw new Error('API URL is not defined');
            }
            const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_REACT_APP_API_URL}/archives/data/all`, {
                params: {
                    type,
                    page,
                    limit: totalPages,
                    numberCase: caseNum,
                    itemNumber: itemNum,
                    statusEvidence,
                    year,
                    actionType
                },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
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
    }, [type, totalPages, actionType]);

    useEffect(() => {
        fetchData(currentPage, debouncedCaseNumber, debouncedItemNumber, debouncedYear || '', statusEvidence);
    }, [currentPage, debouncedCaseNumber, debouncedItemNumber, debouncedYear, totalPages, statusEvidence, actionType, fetchData]);

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
                 {
                    ...editingData,
                    actionType,
                 },
                
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                    params: {
                        type,
                        id: editingData.id,
                    }
                }
            );

            if (response.data.success) {
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
                    fetchData(currentPage, debouncedCaseNumber, debouncedItemNumber, debouncedYear || '', statusEvidence);
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
        { accessorKey: 'typeCaseNumber', header: 'نوع القضية' },
        { accessorKey: 'year', header: 'السنة' },
        { accessorKey: 'charge', header: 'التهمة' },
        { accessorKey: 'seizureStatement', header: 'بيان الحرز' },
        { accessorKey: 'totalNumber', header: 'الرقم الكلي' },
        { accessorKey: 'typeCaseTotalNumber', header: 'نوع القضية للرقم الكلي' },
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
        pageCount: Math.ceil(totalCount / totalPages),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: totalPages // يجب أن تكون هذه القيمة متزامنة مع totalPages
            }
        },
        // أضف هذه الخاصية لتحديث الحالة عند تغيير pageSize
        onPaginationChange: (updater) => {
            const newPagination = updater instanceof Function
                ? updater(table.getState().pagination)
                : updater;
            setCurrentPage(newPagination.pageIndex + 1);
            setTotalPages(newPagination.pageSize);
        }
    });

    const clearFilters = () => {
        setCaseNumberSearch('');
        setItemNumberSearch('');
        setYear('');
        setStatusEvidence('');
        setDebouncedCaseNumber('');
        setDebouncedItemNumber('');
        setDebouncedYear(null);
        
    };



    const exportToExcelFull = async () => {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/archives/data/all/full`, {
            params: {
                type,
                page: currentPage,
                limit: totalPages,
                numberCase: debouncedCaseNumber,
                itemNumber: debouncedItemNumber,
                statusEvidence,
                year,
                actionType
            },
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            }
        });
        const data = res.data.prosecutionData;
        if (data.length === 0) {
            toast.error('لا توجد بيانات للتصدير');
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('القضايا');

            // 1. تصفية الأعمدة لإزالة عمود الإجراءات باستخدام ID
            const filteredColumns = columns.filter(col =>
                col.id !== 'actions'
            );

            // 2. تعيين الأعمدة المصفاة
            worksheet.columns = filteredColumns.map(col => ({
                header: col.header?.toString() || '',
                key: (
                    'accessorKey' in col
                        ? (col.accessorKey as string)
                        : (col as any).accessor
                )?.toString() || '',
                width: 25
            }));

            // 3. إضافة البيانات مرة واحدة بدون تكرار
            data.forEach((archives: ProsecutionData) => {
                const rowData = { ...archives };
                worksheet.addRow(rowData);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `القضايا_${new Date().toISOString()}.xlsx`;
            a.click();

        } catch (error) {
            console.error('Export error:', error);
            toast.error('فشل في التصدير: ' + (error as Error).message);
        }
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
        <div className=" mx-auto p-4 h-full">
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-end">

                <motion.div
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}

                    className="flex  flex-col justify-between gap-3 w-full  "
                >
                    <Select
                        value={actionType}
                        onValueChange={(value) => {
                            setActionType(value);
                        }}
                    >
                        <SelectTrigger className=" self-end  h-full p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                        >
                            <SelectValue placeholder="اختر نوع الجدول" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="action-taken">تم التصرف</SelectItem>
                            <SelectItem value="no-action">لم يتم التصرف</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex  justify-between w-full">
                        <Select
                            value={String(totalPages)}
                            onValueChange={(e) => {
                                // سيتم التعامل مع التغيير عبر onPaginationChange في useReactTable
                                table.setPageSize(Number(e));
                            }}
                        >
                            <SelectTrigger className="  h-full p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                            >
                                <SelectValue placeholder="اختر حالة الحرز" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'5'}>5 لكل صفحة</SelectItem>
                                <SelectItem value={'10'}>10 لكل صفحة</SelectItem>
                                <SelectItem value={'20'}>20 لكل صفحة</SelectItem>
                                <SelectItem value={'50'}>50 لكل صفحة</SelectItem>
                                <SelectItem value={'100'}>100 لكل صفحة</SelectItem>
                            </SelectContent>

                        </Select>
                        <div className=" flex f h-[40px] gap-4">

                           <div className=" w-48">
                           <Select
                                value={statusEvidence}
                                onValueChange={setStatusEvidence}
                            >
                                <SelectTrigger className="w-full border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                    <SelectValue placeholder="اختر حالة الحرز" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="على ذمة التحقيق">على ذمة التحقيق</SelectItem>
                                    <SelectItem value="جاهز للتسليم">جاهز للتسليم</SelectItem>
                                    <SelectItem value="جاهز للبيع">جاهز للبيع</SelectItem>
                                    <SelectItem value="جاهز للاعدام">جاهز للإعدام</SelectItem>
                                    <SelectItem value="تم البيع">تم البيع </SelectItem>
                                    <SelectItem value="تم التسليم"> تم التسليم</SelectItem>
                                    <SelectItem value="تم الاعدام">تم الإعدام</SelectItem>
                                </SelectContent>
                            </Select>

                           </div>

                            <Input
                                type="number"
                                placeholder="ابحث برقم القضية..."
                                className="p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                                value={caseNumberSearch}
                                onChange={(e) => setCaseNumberSearch(e.target.value)}
                                min={'0'}
                            />
                            <Input
                                type="number"
                                placeholder="ابحث برقم الأشياء..."
                                className="p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                                value={itemNumberSearch}
                                onChange={(e) => setItemNumberSearch(e.target.value)}
                                min={'0'}
                            />

                            <Input
                                type="text"
                                placeholder="ابحث  بالسنة..."
                                className="p-2 border rounded-lg w-48 text-right focus:ring-2 focus:ring-blue-500"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                min={'0'}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={clearFilters}
                                className={`px-4 py-2 rounded-lg transition-colors text-xs ${isDarkMode
                                    ? 'bg-[#374151] text-[#93C5FD] hover:bg-[#1F2937]'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                🗑️ مسح التصنيفات
                            </motion.button>


                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={exportToExcelFull}
                                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 text-xs ${isDarkMode
                                    ? 'bg-[#4F46E5] hover:bg-[#2563EB]'
                                    : 'bg-green-500 hover:bg-green-600'
                                    }`}
                            >
                                📥 تصدير الكل Excel
                            </motion.button>
                        </div>
                    </div>


                </motion.div>


            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl border shadow-lg  ${isDarkMode ? 'border-[#374151] bg-[#1F2937]' : 'border-gray-200 bg-white'
                    }`}            >
                <Table dir="rtl" className="min-w-full">
                    <TableHeader className={isDarkMode ? 'bg-[#374151]' : 'bg-blue-50'}>
                        <TableRow>
                            <TableCell className={`text-center font-bold text-lg ${isDarkMode ? 'bg-[#374151] text-[#E5E7EB]' : 'bg-blue-100'}`} colSpan={9}>
                                📁 بيانات الحرز
                            </TableCell>
                            <TableCell className={`text-center font-bold text-lg ${isDarkMode ? 'bg-[#374151] text-[#E5E7EB]' : 'bg-blue-100'}`} colSpan={3}>
                                🚪 مكان تواجد الحرز
                            </TableCell>
                            <TableCell className={`text-center font-bold text-lg ${isDarkMode ? 'bg-[#374151] text-[#E5E7EB]' : 'bg-blue-100'}`} colSpan={3}>
                                📝 التصرف في الاحراز
                            </TableCell>
                            <TableCell className={`text-center font-bold text-lg ${isDarkMode ? 'bg-[#374151] text-[#E5E7EB]' : 'bg-blue-100'}`} colSpan={1}>
                                الإجراءات
                            </TableCell>
                        </TableRow>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className={isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-blue-50'}>
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className={`text-center p-3 font-semibold ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}                                    >
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
                                    className={`${isDarkMode ? 'hover:bg-[#374151] even:bg-[#1F2937]/30' : 'hover:bg-gray-50 even:bg-gray-50/30'}`}                                >
                                    {row.getVisibleCells().map(cell => (
                                        <motion.td
                                            key={cell.id}
                                            className={`text-center p-3 border-t ${isDarkMode ? 'border-[#374151]' : 'border-gray-100'}`}
                                        >
                                            <div className={`px-2 py-1 rounded-md shadow-sm ${isDarkMode
                                                ? 'bg-[#1F2937] text-[#9CA3AF]'
                                                : 'bg-white'
                                                }`}>
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
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * totalPages >= totalCount}
                    className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode
                        ? 'bg-[#374151] text-[#93C5FD] hover:bg-[#1F2937]'
                        : 'bg-gray-100 hover:bg-gray-200'
                        }`} whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    ← التالي
                </motion.button>

                <span className="text-gray-600 font-medium">
                    الصفحة {currentPage} من {Math.ceil(totalCount / totalPages)}
                </span>

                <motion.button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode
                        ? 'bg-[#374151] text-[#93C5FD] hover:bg-[#1F2937]'
                        : 'bg-gray-100 hover:bg-gray-200'
                        }`} whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    السابق →
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
                        className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50   "
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={`rounded-2xl shadow-xl p-8 border  ${isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-white border-blue-100 '} w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
                        >
                            <h2 className={`text-2xl font-bold mb-6 text-center  ${isDarkMode ? 'text-[#E5E7EB]' : 'text-blue-600'
                                }`}>
                                تعديل بيانات الحرز
                            </h2>

                            <form onSubmit={handleUpdate} className="space-y-8 ">
                                {/* قسم بيانات الحرز */}
                                <fieldset className="border-2 border-blue-100 rounded-xl p-6 text-right">
                                    <legend className="px-2 text-xl font-semibold text-blue-600">
                                        بيانات الحرز
                                    </legend>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">


                                        {/* المسلسل */}
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                المسلسل
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                رقم الأشياء
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                رقم القضية
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                السنة
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                التهمة
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                بيان الحرز
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                الرقم الكلي
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                رقم الغرفة
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                رقم الاستاند
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                رقم الرف
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                قرار النيابة
                                            </label>
                                            <Input
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
                                            <label className={`block text-sm font-medium text-gray-700 text-right ${isDarkMode ? 'text-[#E5E7EB]' : 'text-gray-700'}`}>
                                                حكم المحكمة النهائي
                                            </label>
                                            <Input
                                                type="text"
                                                value={editingData.finalCourtJudgment}
                                                onChange={e => setEditingData(prev =>
                                                    prev ? { ...prev, finalCourtJudgment: e.target.value } : null
                                                )}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-xl"
                                            />
                                        </div>

                                        {/* حالة الحرز */}
                                        <div className="space-y-2 ">
                                            <InputStatusEvidence
                                                value={editingData.statusEvidence}
                                                onValueChange={value => setEditingData(prev =>
                                                    prev ? { ...prev, statusEvidence: value } : null
                                                )}
                                            />

                                        </div>
                                    </div>
                                </fieldset>

                                {/* أزرار الإجراءات */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        variant="outline"
                                        className={`px-6 py-2 ${isDarkMode ? 'bg-[#374151] text-[#93C5FD] hover:bg-[#1F2937]' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        إلغاء
                                    </Button>
                                    <Button
                                        type="submit"
                                        className={`bg-indigo-600 hover:bg-indigo-700 px-6 py-2 ${isDarkMode ? 'bg-[#374151] text-[#93C5FD] hover:bg-[#1F2937]' : ' '}`}
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