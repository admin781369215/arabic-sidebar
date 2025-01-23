import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function PerformanceEvaluation() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const evaluations = [
    { id: 1, employeeName: "أحمد محمد", date: "2023-05-01", overallRating: 4.5, strengths: "مهارات قيادية قوية", areasForImprovement: "إدارة الوقت" },
    { id: 2, employeeName: "فاطمة علي", date: "2023-05-01", overallRating: 4.2, strengths: "دقة في العمل", areasForImprovement: "مهارات التواصل" },
    { id: 3, employeeName: "محمود حسن", date: "2023-05-01", overallRating: 3.8, strengths: "روح الفريق", areasForImprovement: "المبادرة" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقييم الأداء</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>تاريخ التقييم</TableHead>
              <TableHead>التقييم العام</TableHead>
              <TableHead>نقاط القوة</TableHead>
              <TableHead>مجالات التحسين</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell>{evaluation.employeeName}</TableCell>
                <TableCell>{evaluation.date}</TableCell>
                <TableCell>{evaluation.overallRating}</TableCell>
                <TableCell>{evaluation.strengths}</TableCell>
                <TableCell>{evaluation.areasForImprovement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة تقييم جديد</Button>
      </CardContent>
    </Card>
  )
}

