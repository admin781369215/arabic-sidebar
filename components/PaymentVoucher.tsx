'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Payment {
  id: number;
  paidTo: string;
  amount: string;
  currency: string;
  description: string;
  date: string;
}

const currencies = [
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'SAR', label: 'ريال سعودي' },
]

export function PaymentVoucher() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPayment: Payment = {
      id: Date.now(),
      paidTo: formData.get('paidTo') as string,
      amount: formData.get('amount') as string,
      currency: formData.get('currency') as string,
      description: formData.get('description') as string,
      date: new Date().toISOString().split('T')[0],
    };
    setPayments([newPayment, ...payments]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col h-screen" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">سند صرف</h1>
      <div className="flex justify-end mb-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Minus className="mr-2 h-4 w-4" /> إضافة سند صرف
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة سند صرف</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="paidTo" className="block text-gray-700 mb-2">تم الصرف إلى</Label>
                <Input
                  id="paidTo"
                  name="paidTo"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <Label htmlFor="amount" className="block text-gray-700 mb-2 mr-2">المبلغ</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  className="w-3/5 px-3 py-2 border rounded-md"
                  required
                />
                <select
                  id="currency"
                  name="currency"
                  className="w-2/5 px-3 py-2 border rounded-md mr-2"
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <Label htmlFor="description" className="block text-gray-700 mb-2">البيان</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">حفظ</Button>
                <Button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="bg-white rounded-md shadow-md p-4 min-h-full">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 text-lg mb-2">لا توجد سندات صرف</p>
              <p className="text-gray-400">ابدأ بإضافة سند صرف جديد من خلال الزر أعلاه</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-white p-6 rounded-lg shadow-lg w-full border border-gray-200 max-w-md mx-auto">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-red-600">سند صرف</h3>
                    <p className="text-gray-500">رقم: {payment.id}</p>
                  </div>
                  <div className="border-t border-b border-gray-200 py-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">التاريخ:</span>
                      <span>{payment.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">تم الصرف إلى:</span>
                      <span>{payment.paidTo}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">المبلغ:</h4>
                    <p>{payment.amount} {currencies.find(c => c.value === payment.currency)?.label}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700"><span className="font-semibold">البيان:</span> {payment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

