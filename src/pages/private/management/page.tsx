'use client';
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
import DialogEditCase from "@/components/case_management/dialogEditCasePrivate";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import DialogShowContact from "@/components/case_management/dialobShowContact";
import ExcelJS from "exceljs";
import { useAuth } from "@/context/userContext";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from 'framer-motion';
import { X } from "lucide-react";

interface Case {
    id: string;
    caseNumber: string;
    memberNumber: string;
    accusation: string;
    defendantQuestion: string;
    officerQuestion: string;
    victimQuestion: string;
    witnessQuestion: string;
    technicalReports: string;
    caseReferral: string;
    isReadyForDecision: boolean;
    actionOther: string;
    year: string;
    investigationID: string;
    accusedName: string;
    reportType: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}



const Page = () => {
    const [data, setData] = useState<Case[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
    });
    const [memberNumber, setMemberNumber] = useState<string>('');
    const [isReadyForDecision, setIsReadyForDecision] = useState<string>('');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    
    const { userData } = useAuth();
    const role = userData?.role;
    const uuid = userData?.id;

    const columns = useMemo<ColumnDef<Case>[]>(() => [
        {
            accessorKey: 'caseNumber',
            header: 'رقم القضية',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'year',
            header: 'السنة',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'caseType',
            header: 'نوع القضية',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'investigationID',
            header: 'رقم حصر التحقيق',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'accusedName',
            header: 'اسم المتهم',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'accusation',
            header: 'التهمة',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'memberNumber',
            header: 'رقم العضو',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'defendantQuestion',
            header: 'سؤال المتهم',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'victimQuestion',
            header: 'سؤال المجني عليه',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'witnessQuestion',
            header: 'سؤال الشهود',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'officerQuestion',
            header: 'سؤال الضابط',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'technicalReports',
            header: 'التقارير الفنية',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'reportType',
            header: 'نوع التقرير',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'actionOther',
            header: "إجراءات أخرى"
        },
        {
            accessorKey: 'isReadyForDecision',
            header: 'جاهزة للتصرف',
            cell: ({ row }) => {
                const hasPending = [
                    row.original.defendantQuestion,
                    row.original.officerQuestion,
                    row.original.victimQuestion,
                    row.original.witnessQuestion,
                    row.original.technicalReports,
                ].some(q => q?.includes('حتى الآن'));
                
                return hasPending ? 'لا' : 'نعم';
            }
        },
        {
            header: 'تعديل',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DialogEditCase
                        caseID={Number(row.original.id)}
                        {...row.original}
                    >
                        <img src="/edit.svg" alt="edit" className="w-6 h-6" />
                    </DialogEditCase>
                </div>
            )
        }
    ], []);

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const params = {
                page,
                pageSize,
                memberNumber,
                isReadyForDecision: isReadyForDecision === 'نعم' 
                    ? true 
                    : isReadyForDecision === 'لا' 
                    ? false 
                    : undefined
            };

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // إضافة قيم افتراضية للبيانات
            const responseData = response.data || {};
            const cases = responseData.data || [];
            const paginationData = responseData.pagination || {
                page: 1,
                pageSize: 10,
                total: 0,
                totalPages: 1
            };

            setData(cases.map((c: Case) => ({
                ...c,
                isReadyForDecision: !!(
                    c.defendantQuestion &&
                    c.officerQuestion &&
                    c.victimQuestion &&
                    c.witnessQuestion &&
                    c.technicalReports &&
                    c.caseReferral
                )
            })));

            setPagination(paginationData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (role === 'admin' || role === 'editor') {
            setIsAuthorized(true);
            fetchData(pagination.page, pagination.pageSize);
        } else {
            setIsAuthorized(false);
        }
    }, [role, pagination.page, pagination.pageSize, memberNumber, isReadyForDecision]);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('القضايا');
            
            worksheet.columns = columns.map(col => ({
                header: col.header?.toString() || '',
                key: (
                    'accessorKey' in col 
                    ? (col.accessorKey as string) 
                    : (col as any).accessor
                )?.toString() || '',
                width: 25
            }));

            let currentPage = 1;
            let totalExported = 0;
            
            while (currentPage <= (pagination?.totalPages || 1)) {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases`, {
                    params: {
                        page: currentPage,
                        pageSize: 100,
                        memberNumber,
                        isReadyForDecision: isReadyForDecision === 'نعم' ? true : false
                    }
                });

                const responseData = response.data || {};
                const cases = responseData.data || [];

                cases.forEach((caseData: Case) => {
                    worksheet.addRow(caseData);
                });

                totalExported += cases.length;
                setExportProgress((totalExported / (pagination?.total || 1)) * 100);
                currentPage++;
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `القضايا_${new Date().toISOString()}.xlsx`;
            a.click();
            
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setIsExporting(false);
            setExportModalOpen(false);
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: {
                pageIndex: (pagination?.page || 1) - 1,
                pageSize: pagination?.pageSize || 10,
            }
        },
        pageCount: pagination?.totalPages || 1,
        manualPagination: true,
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function' 
                ? updater({
                    pageIndex: (pagination?.page || 1) - 1,
                    pageSize: pagination?.pageSize || 10
                }) 
                : updater;
            
            if (typeof newPagination.pageSize === 'number') {
                setPagination(prev => ({
                    ...(prev || {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 1,
                    }),
                    pageSize: newPagination.pageSize,
                    page: 1
                }));
            } else {
                setPagination(prev => ({
                    ...(prev || {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 1,
                    }),
                    page: (newPagination.pageIndex || 0) + 1
                }));
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
                <p className="text-2xl text-red-500">غير مصرح لك بالوصول إلى هذه الصفحة</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className=" h-[70px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إدارة القضايا
                    </h1>
                    <Button
                        onClick={() => setExportModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        تصدير إلى Excel
                    </Button>
                </div>

                <AnimatePresence>
                    {exportModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 w-full max-w-md relative"
                            >
                                <button
                                    onClick={() => setExportModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="space-y-6 text-center">
                                    {isExporting ? (
                                        <>
                                            <Progress value={exportProgress} className="h-3" />
                                            <p className="text-gray-600">
                                                جار التصدير... {Math.round(exportProgress)}%
                                            </p>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-gray-800">تصدير البيانات</h3>
                                            <Button
                                                onClick={handleExport}
                                                className="bg-indigo-600 hover:bg-indigo-700 w-full"
                                            >
                                                بدء التصدير
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex flex-wrap gap-4">
                            
                            <Select value={memberNumber} onValueChange={setMemberNumber}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="رقم العضو" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <SelectItem key={i+1} value={`${i+1}`}>{i+1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={isReadyForDecision} onValueChange={setIsReadyForDecision}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="جاهزة للتصرف" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="نعم">نعم</SelectItem>
                                    <SelectItem value="لا">لا</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setMemberNumber('');
                                    setIsReadyForDecision('');
                                }}
                            >
                                مسح التصنيفات
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">العناصر لكل صفحة:</span>
                            <Select
                                value={`${pagination?.pageSize || 10}`}
                                onValueChange={(value) => setPagination(prev => ({
                                    ...(prev || {
                                        page: 1,
                                        pageSize: 10,
                                        total: 0,
                                        totalPages: 1,
                                    }),
                                    pageSize: Number(value),
                                    page: 1
                                }))}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50, 100].map(size => (
                                        <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

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

                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                        <div className="text-gray-500 text-sm">
                            عرض {data.length} من أصل {pagination?.total || 0} قضية
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPagination(prev => ({
                                    ...(prev || {
                                        page: 1,
                                        pageSize: 10,
                                        total: 0,
                                        totalPages: 1,
                                    }),
                                    page: (prev?.page || 1) - 1
                                }))}
                                disabled={(pagination?.page || 1) === 1}
                            >
                                السابق
                            </Button>
                            
                            <span className="px-4">
                                الصفحة {pagination?.page || 1} من {pagination?.totalPages || 1}
                            </span>
                            
                            <Button
                                variant="outline"
                                onClick={() => setPagination(prev => ({
                                    ...(prev || {
                                        page: 1,
                                        pageSize: 10,
                                        total: 0,
                                        totalPages: 1,
                                    }),
                                    page: (prev?.page || 1) + 1
                                }))}
                                disabled={(pagination?.page || 1) >= (pagination?.totalPages || 1)}
                            >
                                التالي
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;