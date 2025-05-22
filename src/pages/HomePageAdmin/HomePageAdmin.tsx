import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { RiArchiveStackFill } from "react-icons/ri";
import axios from 'axios';
import { useAuth } from '@/context/userContext';

import Cookies from 'js-cookie';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
Chart.register(...registerables);

interface Data {
  breakdown: {
    byStatus: Record<string, number>;
    byProsecutionOffice: Array<{
      id: string;
      name: string;
      total: number;
    }>;
    total: number;
    label: string[];
  };
  tables: {
    noActionTaken: number;
    actionTaken: number;
    combinedTotal: number;
  };
}

const Dashboard = () => {
  const caseTypeChartRef = useRef<HTMLCanvasElement>(null);
  const prosecutionChartRef = useRef<HTMLCanvasElement>(null);
  const caseTypeChartInstanceRef = useRef<Chart | null>(null);
  const prosecutionChartInstanceRef = useRef<Chart | null>(null);
  const [prosecutionOfficeId, setProsecutionOfficeId] = useState<string | null>(" ");
  const { userData } = useAuth() as any;
  const username = userData?.username;

  
  const defaultProsecutionOfficeId = userData?.officesAvailable?.[0]?.id || null;
  const IdOffices = userData?.officesAvailable

  const [data, setData] = useState<Data>({
    breakdown: {
      byStatus: {},
      byProsecutionOffice: [],
      total: 0,
      label: [],
    },
    tables: {
      noActionTaken: 0,
      actionTaken: 0,
      combinedTotal: 0,
    },
  });
  console.log('data', data);

  const [loading, setLoading] = useState(true);
  const token = Cookies.get('token') || '';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/archives/stats`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        params: {
          prosecutionOfficeId: prosecutionOfficeId || defaultProsecutionOfficeId ,
          officesAvailable: userData?.officesAvailable?.map((office: any) => office.id),
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [prosecutionOfficeId]);

  useEffect(() => {
    const initCharts = () => {
      // تدمير المخططات القديمة
      [caseTypeChartInstanceRef, prosecutionChartInstanceRef].forEach(ref => {
        if (ref.current) {
          ref.current.destroy();
          ref.current = null;
        }
      });

      // رسم مخطط توزيع الحالات
      if (caseTypeChartRef.current && data.breakdown.byStatus) {
        const ctx = caseTypeChartRef.current.getContext('2d');
        if (ctx) {
          const statusData = data.breakdown.byStatus;
          const labels = Object.keys(statusData);
          const dataValues = Object.values(statusData);

          caseTypeChartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                data: dataValues,
                backgroundColor: [
                  '#3B82F6', '#10B981', '#F59E0B',
                  '#EF4444', '#8B5CF6', '#64748B', '#EC4899'
                ],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  rtl: true,
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                      family: 'Tajawal',
                      size: 14
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((context.parsed / total) * 100).toFixed(1);
                      return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                  }
                }
              },
              cutout: '70%'
            }
          });
        }
      }

      // رسم مخطط توزيع النيابات
      if (prosecutionChartRef.current && data.breakdown.byProsecutionOffice?.length > 0) {
        const ctx = prosecutionChartRef.current.getContext('2d');
        if (ctx) {
          const prosecutionData = data.breakdown.byProsecutionOffice
            .filter(item => item.total > 0)
            .sort((a, b) => b.total - a.total);

          prosecutionChartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: prosecutionData.map(item => item.name),
              datasets: [{
                label: 'عدد الإحراز',
                data: prosecutionData.map(item => item.total),
                backgroundColor: '#1E3A8A',
                borderRadius: 6,
                barThickness: 30
              }]
            },
            options: {
              indexAxis: 'x', // تم التعديل هنا
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { // المحور Y للأرقام
                  beginAtZero: true,
                  grid: { display: false },
                  title: {
                    display: true,
                    text: 'عدد الإحراز',
                    font: {
                      family: 'Tajawal',
                      size: 14,
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    font: {
                      family: 'Tajawal',
                      size: 12
                    }
                  }
                },
                x: { // المحور X للأسماء
                  ticks: {
                    autoSkip: false,
                    font: {
                      family: 'Tajawal',
                      size: 12
                    }
                  },
                  title: {
                    display: true,
                    text: 'اسم النيابة',
                    font: {
                      family: 'Tajawal',
                      size: 14,
                      weight: 'bold'
                    }
                  }
                }
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    title: (items) => items[0].label,
                    label: (context) => `العدد: ${context.formattedValue}`
                  }
                }
              }
            }
          });
        }
      }
    };

    initCharts();


    return () => {
      [caseTypeChartInstanceRef, prosecutionChartInstanceRef].forEach(ref => {
        if (ref.current) {
          ref.current.destroy();
          ref.current = null;
        }
      });
    };
  }, [data]);
  console.log('data', data);

  return (
    <div dir='rtl' className="flex h-screen overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{username === 'FakhriKhayri' && ('مرحبا بك السيد المستشار فخري خيري المحامي العام الأول')}</h2>
            <p className="text-gray-600">هذه نظرة عامة على نظام  الاحراز</p>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* بطاقة إجمالي الاحراز */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">إجمالي الاحراز</p>
                  <h3 className="text-2xl font-bold">{data.tables.combinedTotal}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <RiArchiveStackFill className="text-purple-500 text-xl" />
                </div>
              </div>
            </div>

            {/* بطاقة الاحراز تم التصرف به */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">الاحــراز لم يتم التصرف به</p>

                  <h3 className="text-2xl font-bold">{data.tables.noActionTaken}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <RiArchiveStackFill className="text-red-500 text-xl" />
                </div>
              </div>
            </div>

            {/* بطاقة الاحراز لم يتم التصرف به */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">الاحــراز تـم التصرف به</p>
                  <h3 className="text-2xl font-bold">{data.tables.actionTaken}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <RiArchiveStackFill className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
            {/* اختيار النيابة للفلترة */}
            <div className="mb-6 self-center">
              <Select dir="rtl" value={prosecutionOfficeId || ''} onValueChange={setProsecutionOfficeId}>
                <SelectTrigger className="w-[200px] bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500">
                  <SelectValue placeholder="اختيار النيابة" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-sm">
                  {
                    username === 'FakhriKhayri' && (
                      <SelectItem value={' '}>الكل</SelectItem>

                    )
                  }                  
                  {IdOffices?.map((office: any) => (
                    <SelectItem key={office.id} value={office.id}>{office.name}</SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>
          </div>



          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* مخطط توزيع الحالات */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">توزيع الاحراز حسب الحالة</h3>
              </div>
              <div className="chart-container relative h-96">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">جارٍ تحميل البيانات...</p>
                  </div>
                ) : data.breakdown.total > 0 ? (
                  <canvas ref={caseTypeChartRef} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">لا توجد بيانات</p>
                  </div>
                )}
              </div>
            </div>

            {/* مخطط توزيع النيابات */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">توزيع الاحراز حسب النيابة</h3>
              </div>
              <div className="chart-container relative h-96">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">جارٍ تحميل البيانات...</p>
                  </div>
                ) : data.breakdown.byProsecutionOffice.some(item => item.total > 0) ? (
                  <canvas ref={prosecutionChartRef} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">لا توجد بيانات</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* جدول القضايا الحديثة */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;