import React from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DetailedPurchaseInvoice {
  id: number
  date: string
  supplierName: string
  totalAmount: number
  paymentType: 'cash' | 'credit'
}

interface DetailedPurchaseInvoiceArchiveProps {
  onBack: () => void
  paymentType: 'cash' | 'credit'
}

export function DetailedPurchaseInvoiceArchive({ onBack, paymentType }: DetailedPurchaseInvoiceArchiveProps) {
  // This is a mock data array. In a real application, you would fetch this data from your backend.
  const invoices: DetailedPurchaseInvoice[] = [
    { id: 1, date: '2023-06-01', supplierName: 'مورد أ', totalAmount: 5000, paymentType: 'cash' },
    { id: 2, date: '2023-06-05', supplierName: 'مورد ب', totalAmount: 7500, paymentType: 'credit' },
    { id: 3, date: '2023-06-10', supplierName: 'مورد ج', totalAmount: 3000, paymentType: 'cash' },
  ]

  const filteredInvoices = invoices.filter(invoice => invoice.paymentType === paymentType)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          أرشيف فواتير المشتريات التفصيلية ({paymentType === 'cash' ? 'نقد' : 'آجل'})
        </h2>
        <Button onClick={onBack}>العودة إلى الفاتورة</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الفاتورة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>اسم المورد</TableHead>
            <TableHead>المبلغ الإجمالي</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.supplierName}</TableCell>
              <TableCell>{invoice.totalAmount.toFixed(2)} ريال</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredInvoices.length === 0 && (
        <div className="text-center mt-4">
          <p>لا توجد فواتير محفوظة</p>
        </div>
      )}
    </div>
  )
}

