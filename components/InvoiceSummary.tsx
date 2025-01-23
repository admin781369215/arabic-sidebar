'use client'

import { useState, useEffect } from 'react'

interface InvoiceSummaryProps {
  totalAmount: number
  paidAmount: number
  onPaidAmountChange: (amount: number) => void
}

export function InvoiceSummary({ totalAmount, paidAmount, onPaidAmountChange }: InvoiceSummaryProps) {
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [remainingLabel, setRemainingLabel] = useState('المبلغ المتبقي')

  useEffect(() => {
    const remaining = paidAmount - totalAmount
    setRemainingAmount(Math.abs(remaining))
    setRemainingLabel(remaining < 0 ? 'المبلغ المتبقي' : 'بقي للزبون')
  }, [totalAmount, paidAmount])

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <label className="block mb-1 ml-2">الإجمالي الكلي</label>
        <input
          type="text"
          className="w-24 border border-gray-300 p-2 rounded ml-2"
          value={totalAmount.toFixed(2)}
          readOnly
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <label className="block mb-1 ml-2">المبلغ المدفوع</label>
        <input
          type="number"
          className="w-24 border border-gray-300 p-2 rounded ml-2"
          value={paidAmount}
          onChange={(e) => onPaidAmountChange(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <label className="block mb-1 ml-2">{remainingLabel}</label>
        <input
          type="text"
          className="w-24 border border-gray-300 p-2 rounded ml-2"
          value={remainingAmount.toFixed(2)}
          readOnly
        />
      </div>
    </div>
  )
}

