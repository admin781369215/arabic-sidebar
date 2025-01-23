'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface KPI {
  label: string
  value: number
  change: number
  icon: React.ReactNode
}

export function ManagerDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [salesData, setSalesData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const sampleKPIs: KPI[] = [
      { label: 'إجمالي المبيعات', value: 50000, change: 5.2, icon: <DollarSign className="h-8 w-8 text-green-500" /> },
      { label: 'عدد الطلبات', value: 150, change: -2.1, icon: <ShoppingCart className="h-8 w-8 text-blue-500" /> },
      { label: 'العملاء الجدد', value: 25, change: 10.5, icon: <Users className="h-8 w-8 text-purple-500" /> },
      { label: 'مستوى المخزون', value: 500, change: -1.5, icon: <Package className="h-8 w-8 text-orange-500" /> },
    ]
    setKpis(sampleKPIs)

    const sampleSalesData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [
        {
          label: 'المبيعات',
          data: [12000, 19000, 3000, 5000, 2000, 3000],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
    setInventoryData(sampleInventoryData)
  }, [])

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم المدير</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.label}
              </CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
              <p className={`text-xs ${kpi.change > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {kpi.change > 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {Math.abs(kpi.change)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المبيعات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData && <Bar data={salesData} options={{ responsive: true }} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>مستوى المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryData && <Line data={inventoryData} options={{ responsive: true }} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

