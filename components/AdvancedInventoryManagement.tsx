'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, AlertTriangle } from 'lucide-react'

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  reorderPoint: number;
}

const categories = [
  "خضروات وفواكه",
  "لحوم وأسماك",
  "منتجات الألبان",
  "معلبات",
  "مشروبات",
  "منظفات",
  "أدوات منزلية"
];

export function AdvancedInventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    expiryDate: '',
    reorderPoint: 0
  });
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch the initial product data from your backend here
    const initialProducts: Product[] = [
      { id: '1', name: 'تفاح أحمر', category: 'خضروات وفواكه', quantity: 100, price: 5, expiryDate: '2023-07-15', reorderPoint: 20 },
      { id: '2', name: 'حليب طازج', category: 'منتجات الألبان', quantity: 50, price: 8, expiryDate: '2023-06-30', reorderPoint: 15 },
      { id: '3', name: 'معكرونة', category: 'معلبات', quantity: 200, price: 3, expiryDate: '2024-12-31', reorderPoint: 50 },
    ];
    setProducts(initialProducts);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct(prev => ({ ...prev, category: value }));
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productWithId = { ...newProduct, id: Date.now().toString() };
    setProducts(prev => [...prev, productWithId]);
    setNewProduct({
      id: '',
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      expiryDate: '',
      reorderPoint: 0
    });
    setIsAddProductModalOpen(false);
  };

  const isLowStock = (product: Product) => product.quantity <= product.reorderPoint;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المخزون المتقدمة</h1>
        <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={addProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنتج</Label>
                <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select value={newProduct.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input id="quantity" name="quantity" type="number" value={newProduct.quantity} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="price">السعر</Label>
                <Input id="price" name="price" type="number" step="0.01" value={newProduct.price} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
                <Input id="expiryDate" name="expiryDate" type="date" value={newProduct.expiryDate} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="reorderPoint">نقطة إعادة الطلب</Label>
                <Input id="reorderPoint" name="reorderPoint" type="number" value={newProduct.reorderPoint} onChange={handleInputChange} required />
              </div>
              <Button type="submit">إضافة المنتج</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المنتج</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>تاريخ انتهاء الصلاحية</TableHead>
            <TableHead>نقطة إعادة الطلب</TableHead>
            <TableHead>الحالة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.price.toFixed(2)} ريال</TableCell>
              <TableCell>{product.expiryDate}</TableCell>
              <TableCell>{product.reorderPoint}</TableCell>
              <TableCell>
                {isLowStock(product) && (
                  <div className="flex items-center text-yellow-500">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    مخزون منخفض
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

