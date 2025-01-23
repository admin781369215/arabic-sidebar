'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useGlobalContext } from '../context/GlobalContext'
import { toast } from "@/components/ui/use-toast"

interface Sale {
  id: string
  productId: string
  quantity: number
  totalPrice: number
  date: string
}

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

export function SalesManagement() {
  const [sales, setSales] = useState<Sale[]>([])
  const { inventory, setInventory } = useGlobalContext()
  const [newSale, setNewSale] = useState<Omit<Sale, 'id'>>({
    productId: '',
    quantity: 0,
    totalPrice: 0,
    date: new Date().toISOString().split('T')[0]
  })
  const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales')
      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }
      const fetchedSales = await response.json()
      setSales(fetchedSales)
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast({
        title: "خطأ",
        description: "فشل في جلب المبيعات",
        variant: "destructive",
      })
    }
  }

  const addSale = async () => {
    if (newSale.productId && newSale.quantity > 0) {
      try {
        const response = await fetch('/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSale),
        })

        if (!response.ok) {
          throw new Error('Failed to add sale')
        }

        const addedSale = await response.json()
        setSales([...sales, addedSale])
        updateInventory(newSale.productId, newSale.quantity)
        setNewSale({
          productId: '',
          quantity: 0,
          totalPrice: 0,
          date: new Date().toISOString().split('T')[0]
        })
        setIsAddSaleModalOpen(false)
        toast({
          title: "تم بنجاح",
          description: "تمت إضافة عملية البيع الجديدة",
        })
      } catch (error) {
        console.error('Error adding sale:', error)
        toast({
          title: "خطأ",
          description: "فشل في إضافة عملية البيع",
          variant: "destructive",
        })
      }
    }
  }

  const updateSale = async () => {
    if (editingSale) {
      try {
        const response = await fetch(`/api/sales/${editingSale.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingSale),
        })

        if (!response.ok) {
          throw new Error('Failed to update sale')
        }

        const updatedSale = await response.json()
        setSales(sales.map(s => s.id === updatedSale.id ? updatedSale : s))
        setEditingSale(null)
        toast({
          title: "تم بنجاح",
          description: "تم تحديث عملية البيع",
        })
      } catch (error) {
        console.error('Error updating sale:', error)
        toast({
          title: "خطأ",
          description: "فشل في تحديث عملية البيع",
          variant: "destructive",
        })
      }
    }
  }

  const deleteSale = async (saleId: string) => {
    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete sale')
      }

      setSales(sales.filter(s => s.id !== saleId))
      toast({
        title: "تم بنجاح",
        description: "تم حذف عملية البيع",
      })
    } catch (error) {
      console.error('Error deleting sale:', error)
      toast({
        title: "خطأ",
        description: "فشل في حذف عملية البيع",
        variant: "destructive",
      })
    }
  }

  const updateInventory = (productId: string, soldQuantity: number) => {
    setInventory(inventory.map(product => 
      product.id === productId 
        ? { ...product, quantity: product.quantity - soldQuantity }
        : product
    ))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingSale) {
      setEditingSale({ ...editingSale, [name]: value })
    } else {
      setNewSale(prev => {
        const updatedSale = { ...prev, [name]: value }
        if (name === 'productId' || name === 'quantity') {
          const product = inventory.find(p => p.id === updatedSale.productId)
          if (product) {
            updatedSale.totalPrice = product.price * Number(updatedSale.quantity)
          }
        }
        return updatedSale
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">إدارة المبيعات</h1>
      
      <Button onClick={() => setIsAddSaleModalOpen(true)} className="mb-4">
        <Plus className="mr-2" /> إضافة عملية بيع جديدة
      </Button>

      <Dialog open={isAddSaleModalOpen} onOpenChange={setIsAddSaleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عملية بيع جديدة</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">المنتج</Label>
              <Select
                value={newSale.productId}
                onValueChange={(value) => handleInputChange({ target: { name: 'productId', value } } as any)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((product) => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">الكمية</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newSale.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalPrice" className="text-right">السعر الإجمالي</Label>
              <Input
                id="totalPrice"
                name="totalPrice"
                type="number"
                value={newSale.totalPrice}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">التاريخ</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newSale.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={addSale}>إضافة</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المنتج</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>السعر الإجمالي</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{inventory.find(p => p.id === sale.productId)?.name}</TableCell>
              <TableCell>{sale.quantity}</TableCell>
              <TableCell>{sale.totalPrice}</TableCell>
              <TableCell>{sale.date}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingSale(sale)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteSale(sale.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingSale && (
        <Dialog open={!!editingSale} onOpenChange={() => setEditingSale(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل عملية البيع</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProductId" className="text-right">المنتج</Label>
                <Select
                  value={editingSale.productId}
                  onValueChange={(value) => handleInputChange({ target: { name: 'productId', value } } as any)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر المنتج" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((product) => (
                      <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editQuantity" className="text-right">الكمية</Label>
                <Input
                  id="editQuantity"
                  name="quantity"
                  type="number"
                  value={editingSale.quantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTotalPrice" className="text-right">السعر الإجمالي</Label>
                <Input
                  id="editTotalPrice"
                  name="totalPrice"
                  type="number"
                  value={editingSale.totalPrice}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDate" className="text-right">التاريخ</Label>
                <Input
                  id="editDate"
                  name="date"
                  type="date"
                  value={editingSale.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={updateSale}>حفظ التغييرات</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

