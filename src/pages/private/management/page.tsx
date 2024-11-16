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

const Page = () => {
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
    }

    const [data, setData] = useState<Case[]>([]);
    const [filteredData, setFilteredData] = useState<Case[]>([]);
    const [pageSize] = useState(10);
    const [memberNumber, setMemberNumber] = useState<string>('');
    const [isReadyForDecision, setIsReadyForDecision] = useState<string>('');

    const getData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases`);
            const cases = response.data.cases || [];

            const updatedCases = cases.map((caseData: Case) => ({
                ...caseData,
                isReadyForDecision: !!(caseData.defendantQuestion &&
                    caseData.officerQuestion &&
                    caseData.victimQuestion &&
                    caseData.witnessQuestion &&
                    caseData.technicalReports &&
                    caseData.caseReferral) // تعيين كـ boolean
            }));

            setData(updatedCases);
            setFilteredData(updatedCases);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const clearFilters = () => {
        setMemberNumber('');
        setIsReadyForDecision('');
    }
    const getDataByUser = async (user: string) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/private/cases/${user}`);
            const cases = response.data.cases || [];

            const updatedCases = cases.map((caseData: Case) => ({
                ...caseData,
                isReadyForDecision: !!(caseData.defendantQuestion &&
                    caseData.officerQuestion &&
                    caseData.victimQuestion &&
                    caseData.witnessQuestion &&
                    caseData.technicalReports &&
                    caseData.caseReferral) // تعيين كـ boolean
            }));

            setData(updatedCases);
            setFilteredData(updatedCases);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        const uuid = Cookies.get('uuid');
        const role = Cookies.get('role');



        switch (role) {
            case 'admin':
                getData();
                break;
            case 'editor':
                if (uuid) {
                    getDataByUser(uuid);
                } else {
                    throw new Error('UUID not found');
                }
                break;
            default:
                console.error('Unauthorized');
        }
    }, []);


    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(item => {
                const memberNumberMatch = memberNumber ? item.memberNumber === memberNumber : true;
                const isReadyForDecisionMatch = isReadyForDecision ? item.isReadyForDecision === (isReadyForDecision === 'لا' ? true : false) : true;

                return memberNumberMatch && isReadyForDecisionMatch;
            });
            setFilteredData(filtered);
        };

        filterData();
    }, [memberNumber, isReadyForDecision, data]);

    console.log(data);


    const columns = useMemo<ColumnDef<Case>[]>(() => [
        {
            accessorKey: 'caseNumber', header: 'رقم القضية', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'memberNumber', header: 'رقم العضو', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'accusation', header: 'التهمة', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'defendantQuestion', header: 'سؤال المتهم', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'officerQuestion', header: 'سؤال الضابط', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'victimQuestion', header: 'سؤال المجني عليه', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'witnessQuestion', header: 'سؤال الشهود', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'technicalReports', header: 'التقارير الفنية', cell: (info) => {
                const caseNumber = info.getValue() as string;
                return (
                    <DialogShowContact contact={caseNumber}>
                        <p>{caseNumber}</p>
                    </DialogShowContact>)
            }
        },
        {
            accessorKey: 'actionOther', header: "اجراءات اخرى"
        },
        {
            accessorKey: 'isReadyForDecision',
            header: 'جاهزة للتصرف',
            cell: (info) => {
                const anyQuestionHasValue = info.row.original.defendantQuestion ||
                    info.row.original.officerQuestion ||
                    info.row.original.victimQuestion ||
                    info.row.original.witnessQuestion;

                const hasPendingText = [
                    info.row.original.defendantQuestion,
                    info.row.original.officerQuestion,
                    info.row.original.victimQuestion,
                    info.row.original.witnessQuestion,
                    info.row.original.technicalReports,
                ].some(question => question && question.includes('حتى الآن'));

                return hasPendingText ? 'لا' : (anyQuestionHasValue ? 'نعم' : 'لا');
            }
        },

        {
            header: 'تعديل',
            cell: (info) => {
                return (
                    <div className="flex justify-center items-center ">
                        <DialogEditCase
                            actionOther={info.row.original.actionOther}
                            caseID={Number(info.row.original.id)}
                            caseNumber={info.row.original.caseNumber}
                            memberNumber={info.row.original.memberNumber}
                            accusation={info.row.original.accusation}
                            defendantQuestion={info.row.original.defendantQuestion}
                            officerQuestion={info.row.original.officerQuestion}
                            victimQuestion={info.row.original.victimQuestion}
                            witnessQuestion={info.row.original.witnessQuestion}
                            technicalReports={info.row.original.technicalReports}
                            caseReferral={info.row.original.caseReferral}
                            isReadyForDecision={info.row.original.isReadyForDecision}
                        >
                            <img src={'/edit.svg'} width={24} height={24} alt="" />
                        </DialogEditCase>
                    </div>
                )
            }
        }
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
            { header: 'رقم القضية', key: 'caseNumber', width: 20 },
            { header: 'رقم العضو', key: 'memberNumber', width: 20 },
            { header: 'التهمة', key: 'accusation', width: 30 },
            { header: 'سؤال المتهم', key: 'defendantQuestion', width: 30 },
            { header: 'سؤال الضابط', key: 'officerQuestion', width: 30 },
            { header: 'سؤال المجني عليه', key: 'victimQuestion', width: 30 },
            { header: 'سؤال الشهود', key: 'witnessQuestion', width: 30 },
            { header: 'التقارير الفنية', key: 'technicalReports', width: 30 },
            { header: 'إجراءات أخرى', key: 'actionOther', width: 20 },
            { header: 'جاهزة للتصرف', key: 'isReadyForDecision', width: 20 },
        ];

        // إضافة البيانات
        data.forEach((item) => {
            worksheet.addRow({
                ...item,
                isReadyForDecision: item.isReadyForDecision ? 'نعم' : 'لا',
            });
        });

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
        <div className="flex flex-col items-center h-[110vh] space-y-4">

            <div dir='rtl' className="w-[1210px] ">
                {/* Filter Section */}
                <div className="flex items-center self-end space-x-4 mb-4 gap-5">

                    <Select dir="rtl" value={memberNumber} onValueChange={(value) => setMemberNumber(value)}>
                        <SelectTrigger className="w-[156px]">
                            <SelectValue placeholder="رقم العضو" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select dir="rtl" value={isReadyForDecision} onValueChange={(value) => setIsReadyForDecision(value)}>
                        <SelectTrigger className="w-[156px]">
                            <SelectValue placeholder=" جاهزة للتصرف" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="نعم">نعم</SelectItem>
                            <SelectItem value="لا">لا</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-purple-700 hover:bg-purple-500" onClick={clearFilters}>مسح الفلاتر</Button>
                    <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-400">
                        تصدير إلى أكسل
                    </Button>
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
    );
};

export default Page;
