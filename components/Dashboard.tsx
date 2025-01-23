'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

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
);

export function Dashboard() {
  // Sample data for charts
  const salesData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المبيعات',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const purchasesData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المشتريات',
        data: [8, 15, 5, 10, 7, 9],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }

  const profitLossData = {
    labels: ['الربح', 'الخسارة'],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">لوحة المعلومات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المبيعات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={salesData} options={{ responsive: true }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>المشتريات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={purchasesData} options={{ responsive: true }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الأرباح والخسائر</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={profitLossData} options={{ responsive: true }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">إجمالي المبيعات</h3>
                <p className="text-3xl font-bold text-green-600">15,000 ريال</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">إجمالي المشتريات</h3>
                <p className="text-3xl font-bold text-red-600">10,000 ريال</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">صافي الربح</h3>
                <p className="text-3xl font-bold text-blue-600">5,000 ريال</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">عدد الطلبات</h3>
                <p className="text-3xl font-bold text-purple-600">150</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

