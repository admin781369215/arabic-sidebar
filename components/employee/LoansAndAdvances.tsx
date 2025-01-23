import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function LoansAndAdvances() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const loans = [
    { id: 1, employeeName: "أحمد محمد", type: "قرض", amount: 5000, remainingAmount: 3000, installment: 500, nextPayment: "2023-07-01" },
    { id: 2, employeeName: "فاطمة علي", type: "سلفة", amount: 2000, remainingAmount: 1000, installment: 250, nextPayment: "2023-06-15" },
    { id: 3, employeeName: "محمود حسن", type: "قرض", amount: 10000, remainingAmount: 8000, installment: 1000, nextPayment: "2023-07-01" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>السلف والقروض</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الموظف</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>المبلغ المتبقي</TableHead>
              <TableHead>القسط</TableHead>
              <TableHead>تاريخ الدفعة القادمة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.employeeName}</TableCell>
                <TableCell>{loan.type}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.remainingAmount}</TableCell>
                <TableCell>{loan.installment}</TableCell>
                <TableCell>{loan.nextPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">إضافة سلفة أو قرض جديد</Button>
      </CardContent>
    </Card>
  )
}

