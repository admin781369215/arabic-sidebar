'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { CashInvoiceArchive } from './CashInvoiceArchive'

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
  discount: number;
  notes: string;
}

export function CashInvoiceForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleFields, setVisibleFields] = useState({
    customerName: true,
    sellerName: true,
    customerPhone: true,
    sellerPhone: true,
    customerAddress: true,
    sellerAddress: true,
    editInvoiceNumber: true,
    editDate: true,
  })
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(
    Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      name: '',
      cartonQuantity: 0,
      quantity: 0,
      price: 0,
      total: 0,
    }))
  )
  const [totalAmount, setTotalAmount] = useState(0)
  const [paidAmount, setPaidAmount] = useState<number | null>(null)
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [remainingLabel, setRemainingLabel] = useState('المبلغ المتبقي')
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [invoiceNumber, setInvoiceNumber] = useState(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000)
  const [vatRate, setVatRate] = useState(0.15); // 15% VAT
  const [currentPage, setCurrentPage] = useState<'form' | 'archive'>('form')
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([])
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const newTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
    setTotalAmount(newTotal)
    const vatAmount = totalAmount * vatRate;
    const totalWithVAT = totalAmount + vatAmount;
    calculateRemaining(totalWithVAT - discount, paidAmount)
  }, [invoiceItems, paidAmount, discount])

  const toggleField = (fieldId: keyof typeof visibleFields) => {
    setVisibleFields(prev => ({ ...prev, [fieldId]: !prev[fieldId] }))
  }

  const calculateTotal = (index: number, field: 'quantity' | 'price', value: number) => {
    const newItems = [...invoiceItems]
    newItems[index][field] = value
    newItems[index].total = newItems[index].quantity * newItems[index].price
    setInvoiceItems(newItems)

    if (index === newItems.length - 1 && newItems[index].name && newItems[index].quantity && newItems[index].price) {
      addNewRow()
    }
  }

  const addNewRow = () => {
    setInvoiceItems([...invoiceItems, {
      id: invoiceItems.length + 1,
      name: '',
      cartonQuantity: 0,
      quantity: 0,
      price: 0,
      total: 0,
    }])
  }

  const calculateRemaining = (total: number, paid: number | null) => {
    const remaining = (paid ?? 0) - total
    setRemainingAmount(Math.abs(remaining))
    setRemainingLabel(remaining < 0 ? 'المبلغ المتبقي' : 'بقي للزبون')
  }

  const saveInvoice = () => {
    const newInvoice: Invoice = {
      id: invoiceNumber,
      date: currentDate,
      totalAmount: totalWithVAT - discount,
      items: invoiceItems.filter(item => item.name && item.quantity && item.price),
      discount: discount,
      notes: notes,
    }
    setSavedInvoices([...savedInvoices, newInvoice])
    resetForm()
    setCurrentPage('archive')
  }

  const resetForm = () => {
    setInvoiceItems(Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      name: '',
      cartonQuantity: 0,
      quantity: 0,
      price: 0,
      total: 0,
    })))
    setPaidAmount(null)
    setRemainingAmount(0)
    setRemainingLabel('المبلغ المتبقي')
    setCurrentDate(new Date().toISOString().split('T')[0])
    setInvoiceNumber(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000)
    setDiscount(0);
    setNotes('');
  }

  const vatAmount = totalAmount * vatRate;
  const totalWithVAT = totalAmount + vatAmount;

  if (currentPage === 'archive') {
    return <CashInvoiceArchive invoices={savedInvoices} onBack={() => setCurrentPage('form')} />
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">خيارات</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>خيارات الحقول</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(visibleFields).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`toggle-${key}`}
                    checked={value}
                    onCheckedChange={() => toggleField(key as keyof typeof visibleFields)}
                  />
                  <Label htmlFor={`toggle-${key}`}>
                    {key === 'customerName' && 'اسم العميل'}
                    {key === 'sellerName' && 'اسم البائع'}
                    {key === 'customerPhone' && 'هاتف العميل'}
                    {key === 'sellerPhone' && 'هاتف البائع'}
                    {key === 'customerAddress' && 'عنوان العميل'}
                    {key === 'sellerAddress' && 'عنوان البائع'}
                    {key === 'editInvoiceNumber' && 'السماح بتعديل رقم الفاتورة'}
                    {key === 'editDate' && 'السماح بتعديل التاريخ'}
                  </Label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <h1 className="text-xl font-bold">فاتورة نقد</h1>
        <Button onClick={() => setCurrentPage('archive')}>أرشيف الفواتير</Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Label className="ml-2">رقم الفاتورة:</Label>
          <Input 
            type="number" 
            value={invoiceNumber} 
            onChange={(e) => setInvoiceNumber(Number(e.target.value))} 
            className="w-24" 
            readOnly={!visibleFields.editInvoiceNumber}
          />
        </div>
        <div className="flex items-center">
          <Label className="ml-2">التاريخ:</Label>
          <Input 
            type="date" 
            value={currentDate} 
            onChange={(e) => setCurrentDate(e.target.value)} 
            className="w-40" 
            readOnly={!visibleFields.editDate}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {visibleFields.customerName && (
          <div className="flex items-center">
            <Label className="ml-2">اسم العميل</Label>
            <Input type="text" className="flex-grow" />
          </div>
        )}
        {visibleFields.sellerName && (
          <div className="flex items-center">
            <Label className="ml-2">اسم البائع</Label>
            <Input type="text" className="flex-grow" />
          </div>
        )}
        {visibleFields.customerPhone && (
          <div className="flex items-center">
            <Label className="ml-2">هاتف العميل</Label>
            <Input type="text" className="flex-grow" />
          </div>
        )}
        {visibleFields.sellerPhone && (
          <div className="flex items-center">
            <Label className="ml-2">هاتف البائع</Label>
            <Input type="text" className="flex-grow" />
          </div>
        )}
        {visibleFields.customerAddress && (
          <div className="flex items-center">
            <Label className="ml-2">عنوان العميل</Label>
            <Input type="text" className="flex-grow" />
          </div>
        )}
        {visibleFields.sellerAddress && (
          <div className="flex items-center">
            <Label className="ml-2">عنوان البائع</Label>
            <Input type="text" className="flex-grow" />
          </div>
        )}
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto mb-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 w-[5%]">رقم الأصناف</th>
              <th className="border border-gray-300 p-2 w-[30%]">الصنف</th>
              <th className="border border-gray-300 p-2 w-[15%]">الكمية بالكرتون</th>
              <th className="border border-gray-300 p-2 w-[15%]">الكمية بالحبة</th>
              <th className="border border-gray-300 p-2 w-[15%]">السعر</th>
              <th className="border border-gray-300 p-2 w-[20%]">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                <td className="border border-gray-300 p-2 text-center">{item.id}</td>
                <td className="border border-gray-300 p-2">
                  <Input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...invoiceItems]
                      newItems[index].name = e.target.value
                      setInvoiceItems(newItems)
                      if (index === invoiceItems.length - 1 && e.target.value && item.quantity && item.price) {
                        addNewRow()
                      }
                    }}
                    className="w-full border-none bg-transparent"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <Input
                    type="number"
                    value={item.cartonQuantity || ''}
                    onChange={(e) => {
                      const newItems = [...invoiceItems]
                      newItems[index].cartonQuantity = Number(e.target.value)
                      setInvoiceItems(newItems)
                    }}
                    className="w-full border-none bg-transparent"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => calculateTotal(index, 'quantity', Number(e.target.value))}
                    className="w-full border-none bg-transparent"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <Input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => calculateTotal(index, 'price', Number(e.target.value))}
                    className="w-full border-none bg-transparent"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <Input
                    type="number"
                    value={item.total.toFixed(2)}
                    readOnly
                    className="w-full border-none bg-transparent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">الإجمالي الكلي:</Label>
          <Input
            type="text"
            value={totalAmount.toFixed(2)}
            readOnly
            className="w-24"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">ضريبة القيمة المضافة ({(vatRate * 100).toFixed(0)}%):</Label>
          <Input
            type="text"
            value={vatAmount.toFixed(2)}
            readOnly
            className="w-24"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">الإجمالي مع الضريبة:</Label>
          <Input
            type="text"
            value={totalWithVAT.toFixed(2)}
            readOnly
            className="w-24"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">الخصم:</Label>
          <Input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-24"
            placeholder="0"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">الإجمالي بعد الخصم:</Label>
          <Input
            type="text"
            value={(totalWithVAT - discount).toFixed(2)}
            readOnly
            className="w-24"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse mt-4">
          <Label className="w-32 text-left align-top">ملاحظات:</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-20 p-2 border border-gray-300 rounded"
            placeholder="أدخل أي ملاحظات إضافية هنا"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">المبلغ المدفوع:</Label>
          <Input
            type="number"
            value={paidAmount || ''}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            className="w-24"
            placeholder="أدخل المبلغ"
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label className="w-32 text-left">{remainingLabel}:</Label>
          <Input
            type="text"
            value={remainingAmount.toFixed(2)}
            readOnly
            className="w-24"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="destructive" className="ml-2" onClick={resetForm}>إلغاء</Button>
        <Button onClick={saveInvoice}>حفظ</Button>
      </div>
    </div>
  )
}

