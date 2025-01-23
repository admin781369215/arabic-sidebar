import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function Documents() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const documents = [
    { id: 1, employeeName: "أحمد محمد", documentType: "عقد العمل", uploadDate: "2023-01-15", expiryDate: "2024-01-14" },
    { id: 2, employeeName: "فاطمة علي", documentType: "شهادة صحية", uploadDate: "2023-03-01", expiryDate: "2024-02-29" },
    { id: 3, employeeName: "محمود حسن", documentType: "إقامة", uploadDate: "2023-05-10", expiryDate: "2024-05-09" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>الوثائق والمستندات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>نوع الوثيقة</TableHead>
              <TableHead>تاريخ الرفع</TableHead>
              <TableHead>تاريخ الانتهاء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.employeeName}</TableCell>
                <TableCell>{document.documentType}</TableCell>
                <TableCell>{document.uploadDate}</TableCell>
                <TableCell>{document.expiryDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة وثيقة جديدة</Button>
      </CardContent>
    </Card>
  )
}

