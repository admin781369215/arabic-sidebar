import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function Salaries() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const salaries = [
    { id: 1, employeeName: "أحمد محمد", position: "مدير", baseSalary: 10000, allowances: 2000, deductions: 500, netSalary: 11500 },
    { id: 2, employeeName: "فاطمة علي", position: "محاسب", baseSalary: 8000, allowances: 1500, deductions: 400, netSalary: 9100 },
    { id: 3, employeeName: "محمود حسن", position: "مندوب مبيعات", baseSalary: 6000, allowances: 2000, deductions: 300, netSalary: 7700 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>الرواتب</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>المنصب</TableHead>
              <TableHead>الراتب الأساسي</TableHead>
              <TableHead>البدلات</TableHead>
              <TableHead>الاستقطاعات</TableHead>
              <TableHead>صافي الراتب</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.map((salary) => (
              <TableRow key={salary.id}>
                <TableCell>{salary.employeeName}</TableCell>
                <TableCell>{salary.position}</TableCell>
                <TableCell>{salary.baseSalary}</TableCell>
                <TableCell>{salary.allowances}</TableCell>
                <TableCell>{salary.deductions}</TableCell>
                <TableCell>{salary.netSalary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة راتب جديد</Button>
      </CardContent>
    </Card>
  )
}

