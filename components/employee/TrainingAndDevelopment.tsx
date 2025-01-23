import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function TrainingAndDevelopment() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const trainings = [
    { id: 1, employeeName: "أحمد محمد", trainingName: "إدارة المشاريع", startDate: "2023-07-01", endDate: "2023-07-05", status: "مسجل" },
    { id: 2, employeeName: "فاطمة علي", trainingName: "مهارات التواصل", startDate: "2023-08-15", endDate: "2023-08-17", status: "مكتمل" },
    { id: 3, employeeName: "محمود حسن", trainingName: "تطوير الذات", startDate: "2023-09-01", endDate: "2023-09-03", status: "قيد الانتظار" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>التدريب والتطوير</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>اسم التدريب</TableHead>
              <TableHead>تاريخ البداية</TableHead>
              <TableHead>تاريخ النهاية</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>{training.employeeName}</TableCell>
                <TableCell>{training.trainingName}</TableCell>
                <TableCell>{training.startDate}</TableCell>
                <TableCell>{training.endDate}</TableCell>
                <TableCell>{training.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة تدريب جديد</Button>
      </CardContent>
    </Card>
  )
}

