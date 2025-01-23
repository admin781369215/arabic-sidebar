'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { useGlobalContext } from '../context/GlobalContext'

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

interface Sale {
  id: string
  productId: string
  quantity: number
  totalPrice: number
  date: string
}

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

export function Reports() {
  const [sales, setSales] = useState<Sale[]>([])
  const { inventory } = useGlobalContext()
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'profit'>('sales')

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales')
      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }
      const fetchedSales = await response.json()
      setSales(fetchedSales)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }

  const filterSalesByDate = () => {
    return sales.filter(sale => 
      (!dateRange.start || sale.date >= dateRange.start) &&
      (!dateRange.end || sale.date <= dateRange.end)
    )
  }

  const generateSalesReport = () => {
    const filteredSales = filterSalesByDate()
    const salesByProduct = filteredSales.reduce((acc, sale) => {
      const product = inventory.find(p => p.id === sale.productId)
      if (product) {
        acc[product.name] = (acc[product.name] || 0) + sale.quantity
      }
      return acc
    }, {} as Record<string, number>)

    const labels = Object.keys(salesByProduct)
    const data = Object.values(salesByProduct)

    return {
      labels,
      datasets: [
        {
          label: 'المبيعات حسب المنتج',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  const generateInventoryReport = () => {
    const labels = inventory.map(product => product.name)
    const data = inventory.map(product => product.quantity)

    return {
      labels,
      datasets: [
        {
          label: 'مستوى المخزون',
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  const generateProfitReport = () => {
    const filteredSales = filterSalesByDate()
    const profitByProduct = filteredSales.reduce((acc, sale) => {
      const product = inventory.find(p => p.id === sale.productId)
      if (product) {
        const profit = (sale.totalPrice / sale.quantity - product.price) * sale.quantity
        acc[product.name] = (acc[product.name] || 0) + profit
      }
      return acc
    }, {} as Record<string, number>)

    const labels = Object.keys(profitByProduct)
    const data = Object.values(profitByProduct)

    return {
      labels,
      datasets: [
        {
          label: 'الربح حسب المنتج',
          data,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">التقارير</h1>
      
      <div className="mb-4 flex space-x-4">
        <div>
          <Label htmlFor="start-date">من تاريخ</Label>
          <Input
            id="start-date"
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="end-date">إلى تاريخ</Label>
          <Input
            id="end-date"
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="report-type">نوع التقرير</Label>
          <Select value={reportType} onValueChange={(value: 'sales' | 'inventory' | 'profit') => setReportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">تقرير المبيعات</SelectItem>
              <SelectItem value="inventory">تقرير المخزون</SelectItem>
              <SelectItem value="profit">تقرير الأرباح</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === 'sales' && 'تقرير المبيعات'}
            {reportType === 'inventory' && 'تقرير المخزون'}
            {reportType === 'profit' && 'تقرير الأرباح'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === 'sales' && <Bar data={generateSalesReport()} />}
          {reportType === 'inventory' && <Bar data={generateInventoryReport()} />}
          {reportType === 'profit' && <Bar data={generateProfitReport()} />}
        </CardContent>
      </Card>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>المنتج</TableHead>
            <TableHead>الكمية المباعة</TableHead>
            <TableHead>إجمالي المبيعات</TableHead>
            <TableHead>الربح</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterSalesByDate().map((sale) => {
            const product = inventory.find(p => p.id === sale.productId)
            const profit = product ? (sale.totalPrice / sale.quantity - product.price) * sale.quantity : 0
            return (
              <TableRow key={sale.id}>
                <TableCell>{product?.name}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{profit.toFixed(2)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

