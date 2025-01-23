'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, AlertTriangle } from 'lucide-react'

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  location: string;
  reorderPoint: number;
}

export function StoreDisplay() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const sampleProducts: Product[] = [
      { id: '1', name: 'منتج أ', quantity: 20, price: 10.99, location: 'رف 1-أ', reorderPoint: 5 },
      { id: '2', name: 'منتج ب', quantity: 15, price: 15.99, location: 'رف 2-ب', reorderPoint: 10 },
      { id: '3', name: 'منتج ج', quantity: 8, price: 7.99, location: 'رف 3-ج', reorderPoint: 15 },
    ];
    setProducts(sampleProducts);
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };

  const isLowStock = (product: Product) => product.quantity <= product.reorderPoint;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">عرض المتجر</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المنتج</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الموقع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.price.toFixed(2)} ريال</TableCell>
              <TableCell>{product.location}</TableCell>
              <TableCell>
                {isLowStock(product) && (
                  <div className="flex items-center text-yellow-500">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    مخزون منخفض
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  تعديل
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <Label htmlFor="product-name">اسم المنتج</Label>
                <Input
                  id="product-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="product-quantity">الكمية</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="product-price">السعر</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="product-location">الموقع</Label>
                <Input
                  id="product-location"
                  value={editingProduct.location}
                  onChange={(e) => setEditingProduct({ ...editingProduct, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="product-reorder-point">نقطة إعادة الطلب</Label>
                <Input
                  id="product-reorder-point"
                  type="number"
                  value={editingProduct.reorderPoint}
                  onChange={(e) => setEditingProduct({ ...editingProduct, reorderPoint: Number(e.target.value) })}
                  required
                />
              </div>
              <Button type="submit">تحديث المنتج</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

