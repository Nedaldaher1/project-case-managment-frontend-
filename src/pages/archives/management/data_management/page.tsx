
'use client';
import { useState, useMemo, useEffect } from "react";
import Cookies from 'js-cookie';
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

interface SeizureRecord {
    serial: number; // مسلسل
    itemNumber: number; // رقم الأشياء
    caseNumber: number; // رقم القضية
    charge: string; // التهمة
    seizureDetails: string; // بيان الحرز
    totalNumber: number; // الرقم الكلي
    squadNumber: number; // رقم الفرقة
    referenceNumber: number; // رقم الإستناد رقم الرف
    seizureDisposal: string; // التصرف في الحرز
}

const table = () => {
    const [filteredData, setFilteredData] = useState<SeizureRecord[][]>([]);
    const [caseNumberFilter, setCaseNumberFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');
    const pageSize = 10; // Initialize pageSize with a default value

    const columns = useMemo<ColumnDef<SeizureRecord[]>[]>(() => [
        {
            accessorKey: 'serial', header: 'مسلسل', cell: (info) => {
                const serial = info.getValue() as string;
                return (
                    <p>{serial}</p>
                )
            }
        },
        {
            accessorKey: 'itemNumber', header: 'رقم الأشياء', cell: (info) => {
                const itemNumber = info.getValue() as string;
                return (
                    <p>{itemNumber}</p>
                )
            }
        },
        {
            accessorKey: 'charge', header: 'التهمة ', cell: (info) => {
                const charge = info.getValue() as string;
                return (
                    <p>{charge}</p>
                )
            }
        },
        {
            accessorKey: 'defendantQuestion', header: 'بيان الحرز ', cell: (info) => {
                const defendantQuestion = info.getValue() as string;
                return (
                    <p>{defendantQuestion}</p>
                )
            }
        },
        {
            accessorKey: 'officerQuestion', header: 'الرقم الكلي', cell: (info) => {
                const officerQuestion = info.getValue() as string;
                return (
                    <p>{officerQuestion}</p>
                )
            }
        },
        {
            accessorKey: 'victimQuestion', header: 'رقم الفرقة', cell: (info) => {
                const victimQuestion = info.getValue() as string;
                return (
                    <p>{victimQuestion}</p>
                )
            }
        },
        {
            accessorKey: 'witnessQuestion', header: 'رقم الإستناد رقم الرف', cell: (info) => {
                const witnessQuestion = info.getValue() as string;
                return (
                    <p>{witnessQuestion}</p>
                )
            }
        },
        {
            accessorKey: 'technicalReports', header: 'التصرف في الحرز', cell: (info) => {
                const technicalReports = info.getValue() as string;
                return (
                    <p>{technicalReports}</p>
                )
            }
        },
        {
            accessorKey: 'actionOther', header: 'إجراءات أخرى', cell: (info) => {
                const actionOther = info.getValue() as string;
                return (
                    <p>{actionOther}</p>
                )
            }
        },
        {
            accessorKey: 'isReadyForDecision', header: 'جاهزة للتصرف', cell: (
                info
            ) => {
                const isReadyForDecision = info.getValue() as boolean;
                return (
                    <p>{isReadyForDecision ? 'نعم' : 'لا'}</p>
                );
            }
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

    const handleNextPage = () => table.nextPage();
    const handlePreviousPage = () => table.previousPage();
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cases');

        // إضافة العناوين
        worksheet.columns = [
            { header: 'مسلسل', key: 'serial', width: 20 },
            { header: 'رقم الأشياء', key: 'itemNumber', width: 20 },
            { header: 'رقم القضية', key: 'caseNumber', width: 30 },
            { header: 'التهمة', key: 'charge', width: 30 },
            { header: 'بيان الحرز', key: 'seizureDetails', width: 30 },
            { header: 'الرقم الكلي', key: 'totalNumber', width: 30 },
            { header: 'رقم الفرقة', key: 'squadNumber', width: 30 },
            { header: 'رقم الإستناد رقم الرف', key: 'referenceNumber', width: 30 },
            { header: 'التصرف في الحرز', key: 'seizureDisposal', width: 20 },
        ];

        // إضافة البيانات


        // تحميل الملف
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cases.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };
    return (
        <div className="flex flex-col items-center justify-center" >
            
            <div dir="rtl" className=" w-[1200px]">
            <div className="flex items-center self-end space-x-4 mb-4 gap-3">
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
                    <TableFooter></TableFooter>
                </Table>
            </div>

        </div>
    );
};

export default table;