'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Package, TrendingUp, CreditCard } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from 'framer-motion'

// TODO: Install and import react-chartjs-2 and chart.js libraries to enable charts
// npm install react-chartjs-2 chart.js
// Then uncomment and update the chart components
/*
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)
*/

interface KPI {
  label: string
  value: number
  change: number
  icon: React.ReactNode
  color: string
}

export function EnhancedDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [salesData, setSalesData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [employeePerformanceData, setEmployeePerformanceData] = useState<any>(null)
  const [customerInsightsData, setCustomerInsightsData] = useState<any>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('month')

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const kpis: KPI[] = [
      { label: 'إجمالي المبيعات', value: 50000, change: 5.2, icon: DollarSign, color: 'text-blue-500' },
      { label: 'عدد الطلبات', value: 150, change: -2.1, icon: ShoppingCart, color: 'text-green-500' },
      { label: 'العملاء الجدد', value: 25, change: 10.5, icon: Users, color: 'text-purple-500' },
      { label: 'مستوى المخزون', value: 500, change: -1.5, icon: Package, color: 'text-orange-500' },
      { label: 'الربح الإجمالي', value: 15000, change: 3.8, icon: TrendingUp, color: 'text-teal-500' },
      { label: 'متوسط قيمة الطلب', value: 333, change: 1.2, icon: CreditCard, color: 'text-pink-500' },
    ]
    setKpis(kpis)

    const sampleSalesData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [
        {
          label: 'المبيعات',
          data: [12000, 19000, 3000, 5000, 2000, 3000],
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
        {
          label: 'المشتريات',
          data: [10000, 15000, 2000, 4000, 1800, 2500],
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        },
      ],
    }
    setSalesData(sampleSalesData)

    const sampleInventoryData = {
      labels: ['منتج أ', 'منتج ب', 'منتج ج', 'منتج د', 'منتج هـ'],
      datasets: [
        {
          label: 'مستوى المخزون',
          data: [100, 75, 50, 125, 80],
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(251, 191, 36, 0.6)',
            'rgba(239, 68, 68, 0.6)',
            'rgba(139, 92, 246, 0.6)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
    setInventoryData(sampleInventoryData)

    const sampleEmployeePerformanceData = {
      labels: ['أحمد', 'فاطمة', 'محمد', 'سارة', 'علي'],
      datasets: [
        {
          label: 'المبيعات الشهرية',
          data: [12000, 19000, 3000, 5000, 2000],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    }
    setEmployeePerformanceData(sampleEmployeePerformanceData)

    const sampleCustomerInsightsData = {
      labels: ['عملاء جدد', 'عملاء عائدون', 'عملاء غير نشطين'],
      datasets: [
        {
          data: [30, 50, 20],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
    setCustomerInsightsData(sampleCustomerInsightsData)
  }, [])

  const handlePOSManagementClick = () => {
    // سيتم تنفيذ هذه الدالة عند النقر على بطاقة إدارة نقاط البيع
    console.log("تم النقر على إدارة نقاط البيع");
    // يمكنك إضافة المزيد من المنطق هنا، مثل فتح نافذة منبثقة أو الانتقال إلى صفحة إدارة نقاط البيع
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
      dir="rtl"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">لوحة التحكم</h1>
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر الفترة الزمنية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">اليوم</SelectItem>
            <SelectItem value="week">الأسبوع</SelectItem>
            <SelectItem value="month">الشهر</SelectItem>
            <SelectItem value="quarter">الربع السنوي</SelectItem>
            <SelectItem value="year">السنة</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.label}
                </CardTitle>
                {React.createElement(kpi.icon, { className: `h-6 w-6 ${kpi.color}` })}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{kpi.value.toLocaleString()}</div>
                <p className={`text-xs ${kpi.change > 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
                  {kpi.change > 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                  {Math.abs(kpi.change)}%
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">المبيعات والمشتريات</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {salesData && <Bar data={salesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} className="h-80" />} */}
            <div className="h-80 bg-gray-100 flex items-center justify-center">
              <p>Sales Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">مستوى المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {inventoryData && <Doughnut data={inventoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} className="h-80" />} */}
            <div className="h-80 bg-gray-100 flex items-center justify-center">
              <p>Inventory Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">أداء الموظفين</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {employeePerformanceData && <Bar data={employeePerformanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} className="h-80" />} */}
            <div className="h-80 bg-gray-100 flex items-center justify-center">
              <p>Employee Performance Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">تحليل العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {customerInsightsData && <Pie data={customerInsightsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} className="h-80" />} */}
            <div className="h-80 bg-gray-100 flex items-center justify-center">
              <p>Customer Insights Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

