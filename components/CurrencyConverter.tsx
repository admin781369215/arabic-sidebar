'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { DollarSign, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { CurrencyOptions } from './CurrencyOptions'

interface CurrencyField {
  id: number
  fromCurrency: string
  toCurrency: string
  fromAmount: string
  toAmount: string
}

const currencies = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'GBP', label: 'جنيه إسترليني' },
  { value: 'JPY', label: 'ين ياباني' },
]

export function CurrencyConverter() {
  const [fields, setFields] = useState<CurrencyField[]>([
    { id: 1, fromCurrency: 'SAR', toCurrency: 'USD', fromAmount: '', toAmount: '' }
  ])

  const addFields = () => {
    const newField: CurrencyField = {
      id: fields.length + 1,
      fromCurrency: 'SAR',
      toCurrency: 'USD',
      fromAmount: '',
      toAmount: ''
    }
    setFields([...fields, newField])
  }

  const handleCurrencyChange = (id: number, type: 'from' | 'to', value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [`${type}Currency`]: value } : field
    ))
  }

  const handleAmountChange = (id: number, type: 'from' | 'to', value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [`${type}Amount`]: value } : field
    ))
  }

  const CurrencySelector = ({ id, type, value }: { id: number, type: 'from' | 'to', value: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between text-right">
          {currencies.find(c => c.value === value)?.label || 'اختر العملة'}
          <DollarSign className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[250px] bg-gray-800 border-gray-700 p-0">
        <DialogTitle className="sr-only">اختر العملة</DialogTitle>
        <div className="py-1">
          {currencies.map((currency) => (
            <button
              key={currency.value}
              className={cn(
                "w-full px-4 py-2 text-right text-white hover:bg-gray-700 focus:bg-gray-700 flex justify-between items-center",
                currency.value === value && "bg-gray-700"
              )}
              onClick={() => handleCurrencyChange(id, type, currency.value)}
            >
              {currency.label}
              {currency.value === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white" dir="rtl">
      <header className="w-full flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6" />
          <h1 className="text-xl font-bold">محول العملات</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CurrencyOptions />
          <Button onClick={addFields}>إضافة حقلين</Button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow w-full">
        <div className="border border-gray-300 rounded-lg p-8 w-3/4 md:w-1/2 lg:w-1/3 text-center">
          <form className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center justify-center space-x-2">
                <CurrencySelector id={field.id} type="from" value={field.fromCurrency} />
                <Input
                  type="number"
                  placeholder="أدخل المبلغ"
                  value={field.fromAmount}
                  onChange={(e) => handleAmountChange(field.id, 'from', e.target.value)}
                  className="w-[120px]"
                />
                <span>=</span>
                <Input
                  type="number"
                  placeholder="أدخل المبلغ"
                  value={field.toAmount}
                  onChange={(e) => handleAmountChange(field.id, 'to', e.target.value)}
                  className="w-[120px]"
                />
                <CurrencySelector id={field.id} type="to" value={field.toCurrency} />
              </div>
            ))}
          </form>
        </div>
      </main>
    </div>
  )
}

