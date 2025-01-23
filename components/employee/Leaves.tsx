import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function Leaves() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const leaves = [
    { id: 1, employeeName: "أحمد محمد", type: "إجازة سنوية", startDate: "2023-07-01", endDate: "2023-07-15", status: "موافق عليها" },
    { id: 2, employeeName: "فاطمة علي", type: "إجازة مرضية", startDate: "2023-06-10", endDate: "2023-06-12", status: "موافق عليها" },
    { id: 3, employeeName: "محمود حسن", type: "إجازة بدون راتب", startDate: "2023-08-01", endDate: "2023-08-15", status: "قيد المراجعة" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإجازات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>نوع الإجازة</TableHead>
              <TableHead>تاريخ البداية</TableHead>
              <TableHead>تاريخ النهاية</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.employeeName}</TableCell>
                <TableCell>{leave.type}</TableCell>
                <TableCell>{leave.startDate}</TableCell>
                <TableCell>{leave.endDate}</TableCell>
                <TableCell>{leave.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة طلب إجازة جديد</Button>
      </CardContent>
    </Card>
  )
}

