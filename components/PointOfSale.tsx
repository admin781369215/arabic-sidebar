'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ArchiveAndCashBox } from './ArchiveAndCashBox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PauseCircle } from 'lucide-react'
import { RefreshCw } from 'lucide-react'
import { useGlobalContext } from '../context/GlobalContext';

interface InvoiceItem {
  id: number;
  name: string;
  code: string;
  unitQuantity: string;
  totalQuantity: string;
  pricePerCarton: string;
  pricePerUnit: string;
  unitsPerCarton: string;
  totalItemPrice: string;
}

interface Invoice {
  id: string;
  date: string;
  total: number;
}

interface PendingInvoice {
  id: string;
  items: InvoiceItem[];
  totalAmount: number;
  discount: number;
  paidAmount: number | null;
}

export function PointOfSale() {
  const { inventory, setInventory, cashBalance, setCashBalance } = useGlobalContext();
  const [items, setItems] = useState<InvoiceItem[]>(
    Array.from({ length: 11 }, (_, index) => ({
      id: index + 1,
      name: '',
      code: '',
      unitQuantity: '',
      totalQuantity: '',
      pricePerCarton: '',
      pricePerUnit: '',
      unitsPerCarton: '',
      totalItemPrice: '',
    }))
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [vatRate, setVatRate] = useState(0.15); // 15% VAT
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [remainingLabel, setRemainingLabel] = useState('المبلغ المتبقي');
  const [initialFloat, setInitialFloat] = useState<number>(0);
  const [isFloatModalOpen, setIsFloatModalOpen] = useState(false);
  const [tempInitialFloat, setTempInitialFloat] = useState<number>(0);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([]);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const [isSuspendedInvoicesModalOpen, setIsSuspendedInvoicesModalOpen] = useState(false);
  // Removed selectedLayout state

  useEffect(() => {
    setDateAndInvoiceNumber();
  }, []);

  useEffect(() => {
    const newTotalAmount = items.reduce((sum, item) => sum + parseFloat(item.totalItemPrice || '0'), 0);
    setTotalAmount(newTotalAmount);
    const vatAmount = totalAmount * vatRate;
    const totalWithVAT = totalAmount + vatAmount;
    calculateRemaining(totalWithVAT - discount, paidAmount);
  }, [items, paidAmount, discount]);

  useEffect(() => {
    if (isFloatModalOpen) {
      setTempInitialFloat(initialFloat);
    }
  }, [isFloatModalOpen, initialFloat]);

  const setDateAndInvoiceNumber = () => {
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    const randomInvoiceNumber = Math.floor(Math.random() * 1000000).toString();
    setInvoiceNumber(randomInvoiceNumber);
  };

  const calculateUnitPrice = (item: InvoiceItem) => {
    const unitsPerCarton = parseFloat(item.unitsPerCarton);
    const pricePerCarton = parseFloat(item.pricePerCarton);
    if (unitsPerCarton && pricePerCarton) {
      return (pricePerCarton / unitsPerCarton).toFixed(2);
    }
    return '';
  };

  const calculateTotalQuantity = (item: InvoiceItem) => {
    const unitQuantity = parseFloat(item.unitQuantity) || 0;
    return unitQuantity.toString();
  };

  const calculateTotalItemPrice = (item: InvoiceItem) => {
    const totalQuantity = parseFloat(item.totalQuantity);
    const pricePerUnit = parseFloat(item.pricePerUnit);
    if (totalQuantity && pricePerUnit) {
      return (totalQuantity * pricePerUnit).toFixed(2);
    }
    return '';
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItems(prevItems => {
      const newItems = [...prevItems];
      const updatedItem = { ...newItems[index], [name]: value };
      
      if (name === 'unitsPerCarton' || name === 'pricePerCarton') {
        updatedItem.pricePerUnit = calculateUnitPrice(updatedItem);
      }
      
      if (name === 'unitQuantity' || name === 'unitsPerCarton') {
        updatedItem.totalQuantity = calculateTotalQuantity(updatedItem);
      }
      
      if (name === 'totalQuantity' || name === 'pricePerUnit' || name === 'pricePerCarton') {
        updatedItem.totalItemPrice = calculateTotalItemPrice(updatedItem);
      }
      
      newItems[index] = updatedItem;

      // Add a new item if the last item is being edited and Enter is pressed
      if (index === newItems.length - 1 && e.key === 'Enter' && updatedItem.name && updatedItem.pricePerUnit) {
        newItems.push({
          id: newItems.length + 1,
          name: '',
          code: '',
          unitQuantity: '',
          totalQuantity: '',
          pricePerCarton: '',
          pricePerUnit: '',
          unitsPerCarton: '',
          totalItemPrice: '',
        });
      }

      return newItems;
    });
  };

  const calculateRemaining = (total: number, paid: number | null) => {
    const remaining = (paid ?? 0) - total;
    setRemainingAmount(Math.abs(remaining));
    setRemainingLabel(remaining < 0 ? 'المبلغ المتبقي' : 'المبلغ المتبقي للعميل');
  };

  const saveInvoice = () => {
    if (items.some(item => item.name && item.totalItemPrice) && paidAmount !== null) {
      const newInvoice = {
        id: currentInvoiceId || invoiceNumber,
        date: invoiceDate,
        total: totalAmount
      };
      setSavedInvoices([...savedInvoices, newInvoice]);
    
      // Update inventory
      const updatedInventory = [...inventory];
      items.forEach(item => {
        const inventoryItem = updatedInventory.find(i => i.name === item.name);
        if (inventoryItem) {
          inventoryItem.quantity -= parseInt(item.unitQuantity);
        }
      });
      setInventory(updatedInventory);

      // Update cash balance
      setCashBalance(prevBalance => prevBalance + paidAmount);

      console.log('Invoice saved:', { items, totalAmount, discount, paidAmount });
      resetForm();
      // Remove the invoice from pending invoices if it exists
      if (currentInvoiceId) {
        setPendingInvoices(prev => prev.filter(inv => inv.id !== currentInvoiceId));
      }
    } else {
      alert('يرجى ملء جميع الحقول المطلوبة قبل الحفظ');
    }
  };

  const setInitialFloatAmount = (amount: number) => {
    setInitialFloat(amount);
  };

  const suspendCurrentInvoice = () => {
    if (items.some(item => item.name && item.totalItemPrice)) {
      const newPendingInvoice: PendingInvoice = {
        id: currentInvoiceId || `pending-${Date.now()}`,
        items,
        totalAmount,
        discount,
        paidAmount
      };
      setPendingInvoices(prev => [...prev.filter(inv => inv.id !== newPendingInvoice.id), newPendingInvoice]);
      resetForm();
    } else {
      alert('لا يمكن تعليق فاتورة فارغة');
    }
  };

  const resumePendingInvoice = (invoiceId: string) => {
    const invoice = pendingInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setItems(invoice.items);
      setTotalAmount(invoice.totalAmount);
      setDiscount(invoice.discount);
      setPaidAmount(invoice.paidAmount);
      setCurrentInvoiceId(invoiceId);
      setPendingInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    }
  };

  const resetForm = () => {
    setItems(Array.from({ length: 11 }, (_, index) => ({
      id: index + 1,
      name: '',
      code: '',
      unitQuantity: '',
      totalQuantity: '',
      pricePerCarton: '',
      pricePerUnit: '',
      unitsPerCarton: '',
      totalItemPrice: '',
    })));
    setDiscount(0);
    setPaidAmount(null);
    setDateAndInvoiceNumber();
    setRemainingAmount(0);
    setCurrentInvoiceId(null);
  };

  const vatAmount = totalAmount * vatRate;
  const totalWithVAT = totalAmount + vatAmount;

  // Removed LayoutSelector component

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-lg w-full max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6 bg-blue-600 text-white p-4 rounded-t-lg">
            <h1 className="text-2xl font-bold">نقطة البيع</h1>
            <Button onClick={() => setIsFloatModalOpen(true)} variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">تعيين المبلغ الأولي</Button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Label className="ml-2">رقم الفاتورة:</Label>
              <Input 
                type="number" 
                value={invoiceNumber} 
                onChange={(e) => setInvoiceNumber(e.target.value)} 
                className="w-24" 
                readOnly
              />
            </div>
            <div className="flex items-center">
              <Label className="ml-2">التاريخ:</Label>
              <Input 
                type="date" 
                value={invoiceDate} 
                onChange={(e) => setInvoiceDate(e.target.value)} 
                className="w-40" 
                readOnly
              />
            </div>
          </div>
          <div className="overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto mb-4">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 w-[5%]">رقم الأصناف</th>
                  <th className="border border-gray-300 p-2 w-[30%]">الصنف</th>
                  <th className="border border-gray-300 p-2 w-[15%]">الكمية بالحبة</th>
                  <th className="border border-gray-300 p-2 w-[15%]">السعر</th>
                  <th className="border border-gray-300 p-2 w-[20%]">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleInputChange(index, e as any)}
                        name="name"
                        className="w-full border-none bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={item.unitQuantity}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleInputChange(index, e as any)}
                        name="unitQuantity"
                        className="w-full border-none bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={item.pricePerUnit}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleInputChange(index, e as any)}
                        name="pricePerUnit"
                        className="w-full border-none bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={item.totalItemPrice}
                        readOnly
                        className="w-full border-none bg-transparent"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full lg:w-1/3 space-y-4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">ملخص الفاتورة</h2>
          <div className="border-b border-gray-200 pb-2">
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label className="w-32 text-left">الإجمالي الكلي:</Label>
              <Input
                type="text"
                value={totalAmount.toFixed(2)}
                readOnly
                className="w-24"
              />
            </div>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label className="w-32 text-left">ضريبة القيمة المضافة ({(vatRate * 100).toFixed(0)}%):</Label>
              <Input
                type="text"
                value={vatAmount.toFixed(2)}
                readOnly
                className="w-24"
              />
            </div>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label className="w-32 text-left">الإجمالي مع الضريبة:</Label>
              <Input
                type="text"
                value={totalWithVAT.toFixed(2)}
                readOnly
                className="w-24"
              />
            </div>
          </div>
          <div className="border-b border-gray-200 pb-2">
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
          </div>
          <div className="border-b border-gray-200 pb-2">
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label className="w-32 text-left">الإجمالي بعد الخصم:</Label>
              <Input
                type="text"
                value={(totalWithVAT - discount).toFixed(2)}
                readOnly
                className="w-24"
              />
            </div>
          </div>
          <div className="border-b border-gray-200 pb-2">
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
          </div>
          <div className="border-b border-gray-200 pb-2">
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
          <div className="mt-6 flex justify-between">
            <div>
              <Button onClick={suspendCurrentInvoice} variant="outline" className="ml-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300">
                <PauseCircle className="w-4 h-4 mr-2" />
                تعليق الفاتورة
              </Button>
              <Button onClick={() => setIsSuspendedInvoicesModalOpen(true)} variant="outline">
                استئناف فاتورة معلقة
              </Button>
              <Dialog open={isSuspendedInvoicesModalOpen} onOpenChange={setIsSuspendedInvoicesModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>الفواتير المعلقة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {pendingInvoices.map((invoice) => (
                      <Button
                        key={invoice.id}
                        onClick={() => {
                          resumePendingInvoice(invoice.id);
                          setIsSuspendedInvoicesModalOpen(false);
                        }}
                        variant="outline"
                        className="w-full justify-start items-center bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        استعادة الفاتورة {invoice.id}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Button variant="outline" onClick={resetForm} className="w-1/2 mr-2">إلغاء</Button>
              <Button onClick={saveInvoice} className="w-1/2 ml-2 bg-green-600 hover:bg-green-700">حفظ</Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">عرض الأرشيف والصندوق</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>الأرشيف ومعلومات الصندوق</DialogTitle>
          </DialogHeader>
          <ArchiveAndCashBox 
            initialFloat={initialFloat}
            savedInvoices={savedInvoices}
            onClose={() => setIsArchiveOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isFloatModalOpen} onOpenChange={setIsFloatModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعيين المبلغ الأولي</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="initialFloat">المبلغ الأولي:</Label>
            <Input
              id="initialFloat"
              type="number"
              placeholder="أدخل المبلغ الأولي"
              value={tempInitialFloat}
              onChange={(e) => setTempInitialFloat(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsFloatModalOpen(false)} variant="outline">إلغاء</Button>
            <Button onClick={() => {
              setInitialFloatAmount(tempInitialFloat);
              setIsFloatModalOpen(false);
            }}>تأكيد</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

