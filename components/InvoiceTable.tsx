'use client'

import { useState, useEffect } from 'react'

interface InvoiceTableProps {
  onTotalChange: (total: number) => void
}

export function InvoiceTable({ onTotalChange }: InvoiceTableProps) {
  const [items, setItems] = useState(Array(11).fill({ name: '', quantity: 0, price: 0, total: 0 }))

  const calculateTotal = (index: number) => {
    const newItems = [...items]
    const item = newItems[index]
    item.total = item.quantity * item.price
    setItems(newItems)
  }

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.total, 0)
    onTotalChange(total)
  }, [items, onTotalChange])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 w-1/20">رقم الأصناف</th>
            <th className="border border-gray-300 p-2 w-1/2">الصنف</th>
            <th className="border border-gray-300 p-2 w-1/6">الكمية</th>
            <th className="border border-gray-300 p-2 w-1/6">السعر</th>
            <th className="border border-gray-300 p-2 w-1/6">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
              <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  className="w-full border-none bg-transparent"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index].name = e.target.value
                    setItems(newItems)
                  }}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  className="w-full border-none bg-transparent"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index].quantity = Number(e.target.value)
                    setItems(newItems)
                    calculateTotal(index)
                  }}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  className="w-full border-none bg-transparent"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index].price = Number(e.target.value)
                    setItems(newItems)
                    calculateTotal(index)
                  }}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  className="w-full border-none bg-transparent"
                  value={item.total}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

