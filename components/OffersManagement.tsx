'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon, TagIcon } from 'lucide-react'

interface Offer {
  id: number;
  name?: string;
  quantity?: number;
  price?: number;
  productExpiry?: string;
  offerStart?: string;
  offerEnd?: string;
  products?: {
    name: string;
    quantity: number;
    price: number;
    expiryDate: string;
  }[];
}

export function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isSingleOfferModalOpen, setIsSingleOfferModalOpen] = useState(false);
  const [isMultiOfferModalOpen, setIsMultiOfferModalOpen] = useState(false);
  const [multiOfferProducts, setMultiOfferProducts] = useState([{ name: '', quantity: 0, price: 0, expiryDate: '' }]);

  useEffect(() => {
    // You can load initial offers from an API or local storage here
  }, []);

  const addSingleOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOffer: Offer = {
      id: Date.now(),
      name: formData.get('name') as string,
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      productExpiry: formData.get('expiry') as string,
      offerStart: formData.get('startDate') as string,
      offerEnd: formData.get('endDate') as string
    };
    setOffers([...offers, newOffer]);
    setIsSingleOfferModalOpen(false);
  };

  const addMultiOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOffer: Offer = {
      id: Date.now(),
      startDate: formData.get('multiStartDate') as string,
      endDate: formData.get('multiEndDate') as string,
      products: multiOfferProducts
    };
    setOffers([...offers, newOffer]);
    setIsMultiOfferModalOpen(false);
    setMultiOfferProducts([{ name: '', quantity: 0, price: 0, expiryDate: '' }]);
  };

  const deleteOffer = (id: number) => {
    setOffers(offers.filter(offer => offer.id !== id));
  };

  const addProductRow = () => {
    setMultiOfferProducts([...multiOfferProducts, { name: '', quantity: 0, price: 0, expiryDate: '' }]);
  };

  const updateMultiOfferProduct = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...multiOfferProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setMultiOfferProducts(updatedProducts);
  };

  return (
    <div className="bg-gray-100 p-4 min-h-screen" dir="rtl">
      <header className="bg-white border-b mb-4">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <TagIcon className="h-6 w-6" />
            <h1 className="text-xl font-semibold">نظام إدارة العروض</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-6">
        <div className="flex justify-end items-center mb-8 space-x-4">
          <Button onClick={() => setIsMultiOfferModalOpen(true)} className="bg-green-500 hover:bg-green-600">
            <PlusIcon className="h-4 w-4 mr-2" />
            إضافة عرض متعدد الأصناف
          </Button>
          <Button onClick={() => setIsSingleOfferModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <PlusIcon className="h-4 w-4 mr-2" />
            إضافة عرض جديد
          </Button>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <TagIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">لا توجد عروض</h2>
            <p className="text-sm text-gray-500">ابدأ بإضافة عرض جديد من خلال الزر أعلاه</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="p-6 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{offer.name || 'عرض متعدد الأصناف'}</h3>
                    {offer.offerStart && offer.offerEnd && (
                      <p className="text-sm text-gray-500">
                        من {offer.offerStart} إلى {offer.offerEnd}
                      </p>
                    )}
                  </div>
                  <Button variant="destructive" onClick={() => deleteOffer(offer.id)}>
                    حذف
                  </Button>
                </div>
                {offer.products ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">الأصناف:</h4>
                    {offer.products.map((product, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">الكمية: {product.quantity}</p>
                        <p className="text-sm text-gray-500">السعر: {product.price} ريال</p>
                        <p className="text-sm text-gray-500">تاريخ انتهاء المنتج: {product.expiryDate}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">الكمية: {offer.quantity}</p>
                    <p className="text-sm text-gray-500">السعر: {offer.price} ريال</p>
                    <p className="text-sm text-gray-500">تاريخ انتهاء المنتج: {offer.productExpiry}</p>
                    <p className="text-sm text-gray-500">تاريخ بداية العرض: {offer.offerStart}</p>
                    <p className="text-sm text-gray-500">تاريخ انتهاء العرض: {offer.offerEnd}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Single Offer Modal */}
      <Dialog open={isSingleOfferModalOpen} onOpenChange={setIsSingleOfferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عرض جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={addSingleOffer}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الصنف</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input id="quantity" name="quantity" type="number" required />
              </div>
              <div>
                <Label htmlFor="price">سعر العرض</Label>
                <Input id="price" name="price" type="number" required />
              </div>
              <div>
                <Label htmlFor="expiry">تاريخ انتهاء المنتج</Label>
                <Input id="expiry" name="expiry" type="date" required />
              </div>
              <div>
                <Label htmlFor="startDate">تاريخ بداية العرض</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="endDate">تاريخ انتهاء العرض</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsSingleOfferModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">حفظ العرض</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Multi Offer Modal */}
      <Dialog open={isMultiOfferModalOpen} onOpenChange={setIsMultiOfferModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>إضافة عرض متعدد الأصناف</DialogTitle>
          </DialogHeader>
          <form onSubmit={addMultiOffer}>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="multiStartDate">تاريخ بدء العرض</Label>
                  <Input id="multiStartDate" name="multiStartDate" type="date" required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="multiEndDate">تاريخ انتهاء العرض</Label>
                  <Input id="multiEndDate" name="multiEndDate" type="date" required />
                </div>
              </div>
              {multiOfferProducts.map((product, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <div>
                    <Input
                      placeholder="اسم الصنف"
                      value={product.name}
                      onChange={(e) => updateMultiOfferProduct(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="الكمية"
                      value={product.quantity}
                      onChange={(e) => updateMultiOfferProduct(index, 'quantity', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="السعر"
                      value={product.price}
                      onChange={(e) => updateMultiOfferProduct(index, 'price', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={product.expiryDate}
                      onChange={(e) => updateMultiOfferProduct(index, 'expiryDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addProductRow} className="w-full">
                <PlusIcon className="h-4 w-4 mr-2" />
                إضافة صنف
              </Button>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsMultiOfferModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">حفظ العرض</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

