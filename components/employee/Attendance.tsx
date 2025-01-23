import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function Attendance() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const attendanceRecords = [
    { id: 1, employeeName: "أحمد محمد", date: "2023-06-01", checkIn: "08:00", checkOut: "17:00", status: "حاضر" },
    { id: 2, employeeName: "فاطمة علي", date: "2023-06-01", checkIn: "08:15", checkOut: "17:10", status: "متأخر" },
    { id: 3, employeeName: "محمود حسن", date: "2023-06-01", checkIn: "-", checkOut: "-", status: "غائب" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>الحضور والانصراف</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>وقت الحضور</TableHead>
              <TableHead>وقت الانصراف</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">تسجيل حضور/انصراف</Button>
      </CardContent>
    </Card>
  )
}

