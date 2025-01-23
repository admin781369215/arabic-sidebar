'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ArrowRight } from 'lucide-react'

interface Product {
  id: string;
  name: string;
  warehouseQuantity: number;
  storeQuantity: number;
}

interface Warehouse {
  id: string;
  name: string;
}

export function InventoryTransfer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [transferQuantity, setTransferQuantity] = useState<{ [key: string]: number }>({});
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const sampleProducts: Product[] = [
      { id: '1', name: 'منتج أ', warehouseQuantity: 100, storeQuantity: 20 },
      { id: '2', name: 'منتج ب', warehouseQuantity: 150, storeQuantity: 30 },
      { id: '3', name: 'منتج ج', warehouseQuantity: 80, storeQuantity: 15 },
    ];
    setProducts(sampleProducts);

    const sampleWarehouses: Warehouse[] = [
      { id: '1', name: 'المخزن الرئيسي' },
      { id: '2', name: 'المخزن الفرعي' },
    ];
    setWarehouses(sampleWarehouses);
  }, []);

  const handleTransferQuantityChange = (productId: string, quantity: number) => {
    setTransferQuantity({ ...transferQuantity, [productId]: quantity });
  };

  const handleTransfer = (product: Product) => {
    setSelectedProduct(product);
    setIsTransferModalOpen(true);
  };

  const confirmTransfer = () => {
    if (selectedProduct && transferQuantity[selectedProduct.id]) {
      const updatedProducts = products.map(p => {
        if (p.id === selectedProduct.id) {
          return {
            ...p,
            warehouseQuantity: p.warehouseQuantity - transferQuantity[p.id],
            storeQuantity: p.storeQuantity + transferQuantity[p.id]
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      setTransferQuantity({ ...transferQuantity, [selectedProduct.id]: 0 });
      setIsTransferModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">نقل المخزون</h1>
      
      <div className="flex items-center space-x-4">
        <Label htmlFor="warehouse-select">اختر المخزن:</Label>
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className="w-[180px]">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المنتج</TableHead>
            <TableHead>الكمية في المخزن</TableHead>
            <TableHead>الكمية في المعرض</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.warehouseQuantity}</TableCell>
              <TableCell>{product.storeQuantity}</TableCell>
              <TableCell>
                <Button onClick={() => handleTransfer(product)}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  نقل إلى المعرض
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>نقل المنتج إلى المعرض</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <p>المنتج: {selectedProduct.name}</p>
              <p>الكمية المتاحة في المخزن: {selectedProduct.warehouseQuantity}</p>
              <div>
                <Label htmlFor="transfer-quantity">الكمية المراد نقلها:</Label>
                <Input
                  id="transfer-quantity"
                  type="number"
                  value={transferQuantity[selectedProduct.id] || ''}
                  onChange={(e) => handleTransferQuantityChange(selectedProduct.id, Number(e.target.value))}
                  max={selectedProduct.warehouseQuantity}
                />
              </div>
              <Button onClick={confirmTransfer}>تأكيد النقل</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

