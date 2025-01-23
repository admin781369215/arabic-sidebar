'use client'

import { useState } from 'react'
import { InvoiceHeader } from './InvoiceHeader'
import { CustomerSellerInfo } from './CustomerSellerInfo'
import { InvoiceTable } from './InvoiceTable'
import { InvoiceSummary } from './InvoiceSummary'
import { OptionsModal } from './OptionsModal'

interface InvoiceFormProps {
  isVisible: boolean;
}

export function InvoiceForm({ isVisible }: InvoiceFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleFields, setVisibleFields] = useState({
    customerName: true,
    sellerName: true,
    customerPhone: true,
    sellerPhone: true,
    customerAddress: true,
    sellerAddress: true,
  })

  const [totalAmount, setTotalAmount] = useState(0)
  const [paidAmount, setPaidAmount] = useState(0)

  const toggleField = (fieldId: keyof typeof visibleFields) => {
    setVisibleFields(prev => ({ ...prev, [fieldId]: !prev[fieldId] }))
  }

  if (!isVisible) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl" dir="rtl">
      <InvoiceHeader onOpenModal={() => setIsModalOpen(true)} />
      <CustomerSellerInfo visibleFields={visibleFields} />
      <InvoiceTable onTotalChange={setTotalAmount} />
      <InvoiceSummary
        totalAmount={totalAmount}
        paidAmount={paidAmount}
        onPaidAmountChange={setPaidAmount}
      />
      <div className="flex justify-end mt-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">إلغاء</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">حفظ</button>
      </div>
      <OptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        visibleFields={visibleFields}
        onToggleField={toggleField}
      />
    </div>
  )
}

