import React from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InvoiceItem {
  id: number
  name: string
  cartonQuantity: number
  quantity: number
  price: number
  total: number
}

interface Invoice {
  id: number
  date: string
  totalAmount: number
  items: InvoiceItem[]
}

interface CashInvoiceArchiveProps {
  invoices: Invoice[]
  onBack: () => void
}

export function CashInvoiceArchive({ invoices, onBack }: CashInvoiceArchiveProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">أرشيف فواتير النقد</h1>
        <Button onClick={onBack}>العودة إلى الفاتورة</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الفاتورة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>المبلغ الإجمالي</TableHead>
            <TableHead>عدد الأصناف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.totalAmount.toFixed(2)} ريال</TableCell>
              <TableCell>{invoice.items.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {invoices.length === 0 && (
        <div className="text-center mt-4">
          <p>لا توجد فواتير محفوظة</p>
        </div>
      )}
    </div>
  )
}

