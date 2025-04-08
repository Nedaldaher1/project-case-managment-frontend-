'use client';
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import { AbilityContext } from '@/context/AbilityContext';
import { useAbility, Can } from '@casl/react';
import { useSearchParams } from "react-router-dom";
import { UserRole } from '@/types/user';

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
    actionOther: string;
    year: string;
    investigationID: string;
    accusedName: string;
    reportType: string;
    actionType: string; // Added property
    officerName?: string; // Added property
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
    const [usernames, setUsernames] = useState<string[]>([]);
    const [username, setUsername] = useState<string>('');
    const [caseReferral, setCaseReferral] = useState<string>('');
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const { userData, token } = useAuth();
    const [searchParams] = useSearchParams();
    const [year, setYear] = useState<string>('');
    const [caseNumber, setCaseNumber] = useState<string>('');
    const type = searchParams.get('type');
    const role = userData?.role;
    const uuid = userData?.id;
    const isAdmin = userData?.role === UserRole.ADMIN;
    const ability = useAbility(AbilityContext);




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
            accessorKey: 'officerName',
            header: 'اسم الضابط',
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
            accessorKey: 'actionType',
            header: 'نوع الإجراء',
            cell: ({ getValue }) => (
                <DialogShowContact contact={getValue() as string}>
                    <p>{getValue() as string}</p>
                </DialogShowContact>
            )
        },
        {
            accessorKey: 'caseReferral',
            header: 'جاهزة للتصرف',
        },
        {
            accessorKey: "تعديل",
            header: 'تعديل',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DialogEditCase
                        caseID={Number(row.original.id)}
                        {...row.original}
                        officerName={row.original.officerName || 'N/A'}
                    >
                        <img src="/edit.svg" alt="edit" className="w-6 h-6" />
                    </DialogEditCase>
                </div>
            )
        }
    ], []);

    const fetchAllData = async (page: number, pageSize: number) => {
        try {
            const params = {
                page,
                pageSize,
                caseReferral,
                year,
                caseNumber,
                username,
                type
            };

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases`, {
                params,
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
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

            })));

            setPagination(paginationData);
        } catch (error) {
            if ((error as any).response.status === 404) {
                setData([]);
                setPagination({
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 1,
                });
                return;
            }
            console.error("Error fetching data:", (error as any).response.status);
        }
    };

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const params = {
                page,
                pageSize,
                caseReferral,
                year,
                caseNumber,
                username,
                type, // استخدام القيمة المنظفة

            };

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/${userData?.username}`, {
                params,
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
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

            })));

            setPagination(paginationData);
        } catch (error) {
            if ((error as any).response.status === 404) {
                setData([]);
                setPagination({
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 1,
                });
                return;
            }
            console.error("Error fetching data:", (error as any).response.status);
        }
    };

    const getAllUsernames = async () => {
        try {

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/get/all/username`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });
            setUsernames(response.data.usernames);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    const handleExport = async () => {
        setIsExporting(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('القضايا');

            // 1. تصفية الأعمدة لإزالة عمود التعديل
            const filteredColumns = columns.filter(col => {
                const accessor = (
                    'accessorKey' in col
                        ? col.accessorKey
                        : (col as any).accessor
                )?.toString();
                return accessor !== 'تعديل'; // أو المعرف الذي تستخدمه لعمود التعديل
            });

            // 2. استخدام الأعمدة المصفاة
            worksheet.columns = filteredColumns.map(col => ({
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
                data.forEach((caseData: Case) => {
                    // 3. إنشاء كائن بيانات بدون عمود التعديل
                    const rowData: Partial<Case> = { ...caseData };
                    delete (rowData as any).تعديل; // استبدل 'تعديل' بالاسم الفعلي للخاصية

                    worksheet.addRow(rowData);
                });
                totalExported += data.length;
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

    const handleExportFull = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/all/full`, {
                params: {
                    type,
                },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });
            const data: Case[] = res.data.data;
            console.log(data);
            setIsExporting(true);
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('القضايا');

            // 1. تصفية الأعمدة لإزالة عمود التعديل
            const filteredColumns = columns.filter(col => {
                const accessor = (
                    'accessorKey' in col
                        ? col.accessorKey
                        : (col as any).accessor
                )?.toString();
                return accessor !== 'تعديل'; // أو المعرف الذي تستخدمه لعمود التعديل
            });

            // 2. استخدام الأعمدة المصفاة
            worksheet.columns = filteredColumns.map(col => ({
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
                data.forEach((caseData: Case) => {
                    // 3. إنشاء كائن بيانات بدون عمود التعديل
                    const rowData: Partial<Case> = { ...caseData };
                    delete (rowData as any).تعديل; // استبدل 'تعديل' بالاسم الفعلي للخاصية

                    worksheet.addRow(rowData);
                });
                totalExported += data.length;
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
    }


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




    // تعديل useEffect الرئيسي
    useEffect(() => {
        if (isAdmin) {
            fetchAllData(pagination.page, pagination.pageSize);
            getAllUsernames();
        } else {
            fetchData(pagination.page, pagination.pageSize);
        }
    }, [role, pagination.page, pagination.pageSize, caseReferral, username, year, caseNumber]);

    console.log("data", data);
    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className=" h-[70px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إدارة قضايا الاعضاء
                    </h1>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setExportModalOpen(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            تصدير إلى Excel
                        </Button>
                        <Button
                            onClick={handleExportFull}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            📥 تصدير الكل Excel
                        </Button>
                    </div>
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
                            <Can I="manage" a="admin" ability={ability}>
                                <Select value={username} onValueChange={setUsername}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder=" اسماء الاعضاء" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usernames.map(username => (
                                            <SelectItem key={username} value={username}>{username}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Can>


                            <Select value={caseReferral} onValueChange={setCaseReferral}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="جاهزة للتصرف" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="نعم">نعم</SelectItem>
                                    <SelectItem value="لا">لا</SelectItem>
                                </SelectContent>
                            </Select>


                            <Select value={year} onValueChange={setYear}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="السنة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2026">2026</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                value={caseNumber}
                                onChange={(e) => setCaseNumber(e.target.value)}
                                placeholder="رقم القضية"
                                className="w-40"

                            />
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setUsername('');
                                    setCaseReferral('');
                                    setYear('');
                                    setCaseNumber('');
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