'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DetailedPurchaseInvoiceArchive } from './DetailedPurchaseInvoiceArchive'

interface Item {
  id: number;
  name: string;
  code: string;
  cartonQuantity: string;
  unitQuantity: string;
  totalQuantity: string;
  productionDate: string;
  expiryDate: string;
  pricePerCarton: string;
  pricePerUnit: string;
  unitsPerCarton: string;
  purchasePricePerCarton: string;
  purchasePricePerUnit: string;
  totalItemPrice: string;
  warehouseId: string;
}

export function DetailedPurchaseInvoice({ paymentType }: { paymentType: 'cash' | 'credit' }) {
  const [items, setItems] = useState<Item[]>([{
    id: 0,
    name: '',
    code: '',
    cartonQuantity: '',
    unitQuantity: '',
    totalQuantity: '',
    productionDate: '',
    expiryDate: '',
    pricePerCarton: '',
    pricePerUnit: '',
    unitsPerCarton: '',
    purchasePricePerCarton: '',
    purchasePricePerUnit: '',
    totalItemPrice: '',
    warehouseId: '',
  }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierNumber, setSupplierNumber] = useState('');
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'المخزن الرئيسي' },
    { id: '2', name: 'المخزن الفرعي' },
  ]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [currentView, setCurrentView] = useState<'form' | 'archive'>('form');

  useEffect(() => {
    setDateAndInvoiceNumber();
  }, []);

  useEffect(() => {
    const newTotalAmount = items.reduce((sum, item) => sum + parseFloat(item.totalItemPrice || '0'), 0);
    setTotalAmount(newTotalAmount);
  }, [items]);

  const setDateAndInvoiceNumber = () => {
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    const randomInvoiceNumber = Math.floor(Math.random() * 1000000).toString();
    setInvoiceNumber(randomInvoiceNumber);
  };

  const calculateUnitPrice = (item: Item) => {
    const unitsPerCarton = parseFloat(item.unitsPerCarton);
    const purchasePricePerCarton = parseFloat(item.purchasePricePerCarton);
    if (unitsPerCarton && purchasePricePerCarton) {
      return (purchasePricePerCarton / unitsPerCarton).toFixed(2);
    }
    return '';
  };

  const calculateTotalQuantity = (item: Item) => {
    const cartonQuantity = parseFloat(item.cartonQuantity) || 0;
    const unitQuantity = parseFloat(item.unitQuantity) || 0;
    const unitsPerCarton = parseFloat(item.unitsPerCarton) || 1;
    return (cartonQuantity * unitsPerCarton + unitQuantity).toString();
  };

  const calculateTotalItemPrice = (item: Item) => {
    const totalQuantity = parseFloat(item.totalQuantity);
    const purchasePricePerUnit = parseFloat(item.purchasePricePerUnit);
    if (totalQuantity && purchasePricePerUnit) {
      return (totalQuantity * purchasePricePerUnit).toFixed(2);
    }
    return '';
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItems(prevItems => {
      const newItems = [...prevItems];
      const updatedItem = { ...newItems[index], [name]: value };

      if (name === 'unitsPerCarton' || name === 'purchasePricePerCarton') {
        updatedItem.purchasePricePerUnit = calculateUnitPrice(updatedItem);
      }

      if (name === 'cartonQuantity' || name === 'unitQuantity' || name === 'unitsPerCarton') {
        updatedItem.totalQuantity = calculateTotalQuantity(updatedItem);
      }

      if (name === 'totalQuantity' || name === 'purchasePricePerUnit' || name === 'purchasePricePerCarton') {
        updatedItem.totalItemPrice = calculateTotalItemPrice(updatedItem);
      }

      newItems[index] = updatedItem;
      return newItems;
    });
  };

  const addNewItemFields = () => {
    setItems(prevItems => [
      ...prevItems,
      {
        id: Date.now(),
        name: '',
        code: '',
        cartonQuantity: '',
        unitQuantity: '',
        totalQuantity: '',
        productionDate: '',
        expiryDate: '',
        pricePerCarton: '',
        pricePerUnit: '',
        unitsPerCarton: '',
        purchasePricePerCarton: '',
        purchasePricePerUnit: '',
        totalItemPrice: '',
        warehouseId: '',
      }
    ]);
  };

  const saveItems = () => {
    const newTotalAmount = items.reduce((sum, item) => sum + parseFloat(item.totalItemPrice || '0'), 0);
    setTotalAmount(newTotalAmount);
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl" dir="rtl">
      {currentView === 'form' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">
              {paymentType === 'cash' ? 'فاتورة مشتريات تفصيلية نقد' : 'فاتورة مشتريات تفصيلية آجل'}
            </h1>
            <Button variant="outline" onClick={() => setCurrentView(currentView === 'form' ? 'archive' : 'form')}>
              {currentView === 'form' ? 'أرشيف' : 'العودة إلى الفاتورة'}
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input id="date" type="date" value={invoiceDate} readOnly />
            </div>
            <div>
              <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
              <Input id="invoiceNumber" type="text" value={invoiceNumber} readOnly />
            </div>
            <div>
              <Label htmlFor="supplierName">اسم المورد</Label>
              <Input
                id="supplierName"
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="اسم المورد"
              />
            </div>
            <div>
              <Label htmlFor="supplierNumber">الرقم</Label>
              <Input
                id="supplierNumber"
                type="text"
                value={supplierNumber}
                onChange={(e) => setSupplierNumber(e.target.value)}
                placeholder="الرقم"
              />
            </div>
          </div>

          <h3 className="text-md mb-4 font-semibold">إضافة الأصناف</h3>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-5 gap-4 mb-4 p-4 border rounded relative ${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm font-bold rounded-bl">
                {index + 1}
              </div>
              <div className="col-span-5">
                <Label htmlFor={`itemName-${index}`}>الصنف</Label>
                <Input
                  id={`itemName-${index}`}
                  name="name"
                  value={item.name}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="الاسم"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`itemCode-${index}`}>الرمز</Label>
                <Input
                  id={`itemCode-${index}`}
                  name="code"
                  type="text"
                  value={item.code}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="الرمز"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`cartonQuantity-${index}`}>عدد الكراتين</Label>
                <Input
                  id={`cartonQuantity-${index}`}
                  name="cartonQuantity"
                  type="number"
                  value={item.cartonQuantity}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="عدد الكراتين"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`unitQuantity-${index}`}>الكمية بالحبة</Label>
                <Input
                  id={`unitQuantity-${index}`}
                  name="unitQuantity"
                  type="number"
                  value={item.unitQuantity}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="الكمية بالحبة"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`unitsPerCarton-${index}`}>كم حبة في الكرتون</Label>
                <Input
                  id={`unitsPerCarton-${index}`}
                  name="unitsPerCarton"
                  type="number"
                  value={item.unitsPerCarton}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="كم حبة في الكرتون"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`totalQuantity-${index}`}>إجمالي الكمية بالحبة</Label>
                <Input
                  id={`totalQuantity-${index}`}
                  name="totalQuantity"
                  type="number"
                  value={item.totalQuantity}
                  readOnly
                  placeholder="إجمالي الكمية بالحبة"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`productionDate-${index}`}>تاريخ الإنتاج</Label>
                <Input
                  id={`productionDate-${index}`}
                  name="productionDate"
                  type="date"
                  value={item.productionDate}
                  onChange={(e) => handleInputChange(index, e)}
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`expiryDate-${index}`}>تاريخ الإنتهاء</Label>
                <Input
                  id={`expiryDate-${index}`}
                  name="expiryDate"
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) => handleInputChange(index, e)}
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`pricePerCarton-${index}`}>سعر البيع بالكرتون</Label>
                <Input
                  id={`pricePerCarton-${index}`}
                  name="pricePerCarton"
                  type="number"
                  value={item.pricePerCarton}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="سعر البيع بالكرتون"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`pricePerUnit-${index}`}>سعر البيع بالحبة</Label>
                <Input
                  id={`pricePerUnit-${index}`}
                  name="pricePerUnit"
                  type="number"
                  value={item.pricePerUnit}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="سعر البيع بالحبة"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`purchasePricePerCarton-${index}`}>سعر شراء الكرتون</Label>
                <Input
                  id={`purchasePricePerCarton-${index}`}
                  name="purchasePricePerCarton"
                  type="number"
                  value={item.purchasePricePerCarton}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="سعر شراء الكرتون"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`purchasePricePerUnit-${index}`}>سعر شراء الحبة</Label>
                <Input
                  id={`purchasePricePerUnit-${index}`}
                  name="purchasePricePerUnit"
                  type="number"
                  value={item.purchasePricePerUnit}
                  readOnly
                  placeholder="سعر شراء الحبة"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
              <div>
                <Label htmlFor={`warehouse-${index}`}>المخزن</Label>
                <Select
                  value={selectedWarehouse}
                  onValueChange={(value) => setSelectedWarehouse(value)}
                >
                  <SelectTrigger className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}>
                    <SelectValue placeholder="اختر المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`totalItemPrice-${index}`}>إجمالي الصنف</Label>
                <Input
                  id={`totalItemPrice-${index}`}
                  name="totalItemPrice"
                  type="number"
                  value={item.totalItemPrice}
                  readOnly
                  placeholder="إجمالي الصنف"
                  className={`w-full ${index % 2 === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white'} border rounded`}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-4 space-x-reverse mt-4">
            <Button onClick={addNewItemFields} className="bg-blue-600 hover:bg-blue-700 text-white">إضافة صنف</Button>
            <Button onClick={saveItems} className="bg-green-600 hover:bg-green-700 text-white">حفظ</Button>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">الإجمالي الكلي</h3>
            <p className="text-lg font-bold">{totalAmount.toFixed(2)}</p>
          </div>
        </>
      ) : (
        <DetailedPurchaseInvoiceArchive onBack={() => setCurrentView('form')} paymentType={paymentType} />
      )}
    </div>
  )
}

