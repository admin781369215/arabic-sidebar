import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function WorkSchedules() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const schedules = [
    { id: 1, employeeName: "أحمد محمد", shift: "صباحي", startTime: "08:00", endTime: "16:00", days: "الأحد - الخميس" },
    { id: 2, employeeName: "فاطمة علي", shift: "مسائي", startTime: "16:00", endTime: "00:00", days: "الأحد - الخميس" },
    { id: 3, employeeName: "محمود حسن", shift: "ليلي", startTime: "00:00", endTime: "08:00", days: "الأحد - الخميس" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>جدول المناوبات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>الوردية</TableHead>
              <TableHead>وقت البدء</TableHead>
              <TableHead>وقت الانتهاء</TableHead>
              <TableHead>أيام العمل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.employeeName}</TableCell>
                <TableCell>{schedule.shift}</TableCell>
                <TableCell>{schedule.startTime}</TableCell>
                <TableCell>{schedule.endTime}</TableCell>
                <TableCell>{schedule.days}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة مناوبة جديدة</Button>
      </CardContent>
    </Card>
  )
}

