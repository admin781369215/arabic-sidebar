'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Invoice {
  id: string;
  date: string;
  total: number;
}

interface ArchiveAndCashBoxProps {
  initialFloat: number;
  savedInvoices: Invoice[];
  onClose: () => void;
}

export function ArchiveAndCashBox({ initialFloat, savedInvoices, onClose }: ArchiveAndCashBoxProps) {

  const totalSales = savedInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الأرشيف ومعلومات الصندوق</h1>
        <Button onClick={onClose}>إغلاق</Button>
      </div>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">معلومات الصندوق</h2>
        <div className="flex justify-between items-center">
          <span>المبلغ الأولي:</span>
          <span>{initialFloat.toFixed(2)} ريال</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>إجمالي المبيعات:</span>
          <span>{totalSales.toFixed(2)} ريال</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>إجمالي نهاية الوردية:</span>
          <span>{(initialFloat + totalSales).toFixed(2)} ريال</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">أرشيف المبيعات</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">رقم الفاتورة</th>
            <th className="border border-gray-300 p-2">التاريخ</th>
            <th className="border border-gray-300 p-2">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {savedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="border border-gray-300 p-2">{invoice.id}</td>
              <td className="border border-gray-300 p-2">{invoice.date}</td>
              <td className="border border-gray-300 p-2">{invoice.total.toFixed(2)} ريال</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Button onClick={() => {/* Navigate back to PointOfSale */}}>العودة إلى نقطة البيع</Button>
      </div>
    </div>
  )
}

