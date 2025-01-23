'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const currencies = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'GBP', label: 'جنيه إسترليني' },
  { value: 'JPY', label: 'ين ياباني' },
]

export function CurrencyOptions() {
  const [isOpen, setIsOpen] = useState(false)
  const [primaryCurrency, setPrimaryCurrency] = useState('SAR')

  const handleSave = () => {
    // Here you would typically save the primary currency to your global state or backend
    console.log('Primary currency set to:', primaryCurrency)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">خيارات العملة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>خيارات العملة</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="primaryCurrency" className="text-right">
              العملة الرئيسية
            </Label>
            <Select value={primaryCurrency} onValueChange={setPrimaryCurrency}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="اختر العملة الرئيسية" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

