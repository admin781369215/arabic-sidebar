'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Save } from 'lucide-react'
import { useGlobalContext } from '../context/GlobalContext'
import { toast } from "@/components/ui/use-toast"

interface Warehouse {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  code: string
  quantity: number
  price: number
  purchasePrice: number
  expiryDate: string
  warehouseId: string
}

export function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null)
  const { inventory, setInventory } = useGlobalContext()
  const [newWarehouseName, setNewWarehouseName] = useState('')
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    code: '',
    quantity: 0,
    price: 0,
    purchasePrice: 0,
    expiryDate: '',
    warehouseId: '',
  })
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchWarehouses()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const products = await response.json()
      setInventory(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "خطأ",
        description: "فشل في جلب المنتجات",
        variant: "destructive",
      })
    }
  }

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses')
      if (!response.ok) {
        throw new Error('Failed to fetch warehouses')
      }
      const fetchedWarehouses = await response.json()
      setWarehouses(fetchedWarehouses)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      toast({
        title: "خطأ",
        description: "فشل في جلب المخازن",
        variant: "destructive",
      })
    }
  }

  const addWarehouse = async () => {
    if (newWarehouseName) {
      try {
        const response = await fetch('/api/warehouses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newWarehouseName }),
        })

        if (!response.ok) {
          throw new Error('Failed to add warehouse')
        }

        const addedWarehouse = await response.json()
        setWarehouses([...warehouses, addedWarehouse])
        setNewWarehouseName('')
        setIsAddWarehouseModalOpen(false)
        toast({
          title: "تم بنجاح",
          description: "تمت إضافة المخزن الجديد",
        })
      } catch (error) {
        console.error('Error adding warehouse:', error)
        toast({
          title: "خطأ",
          description: "فشل في إضافة المخزن",
          variant: "destructive",
        })
      }
    }
  }

  const deleteWarehouse = async () => {
    if (selectedWarehouse) {
      try {
        const response = await fetch(`/api/warehouses/${selectedWarehouse}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete warehouse')
        }

        const updatedWarehouses = warehouses.filter(w => w.id !== selectedWarehouse)
        setWarehouses(updatedWarehouses)
        setSelectedWarehouse(null)
        toast({
          title: "تم بنجاح",
          description: "تم حذف المخزن",
        })
      } catch (error) {
        console.error('Error deleting warehouse:', error)
        toast({
          title: "خطأ",
          description: "فشل في حذف المخزن",
          variant: "destructive",
        })
      }
    }
  }

  const addProduct = async () => {
    if (selectedWarehouse && newProduct.name && newProduct.code) {
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newProduct,
            warehouseId: selectedWarehouse,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to add product')
        }

        const addedProduct = await response.json()
        setInventory([...inventory, addedProduct])
        setNewProduct({
          name: '',
          code: '',
          quantity: 0,
          price: 0,
          purchasePrice: 0,
          expiryDate: '',
          warehouseId: '',
        })
        setIsAddProductModalOpen(false)
        toast({
          title: "تم بنجاح",
          description: "تمت إضافة المنتج الجديد",
        })
      } catch (error) {
        console.error('Error adding product:', error)
        toast({
          title: "خطأ",
          description: "فشل في إضافة المنتج",
          variant: "destructive",
        })
      }
    }
  }

  const updateProduct = async () => {
    if (editingProduct) {
      try {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        })

        if (!response.ok) {
          throw new Error('Failed to update product')
        }

        const updatedProduct = await response.json()
        setInventory(inventory.map(p => p.id === updatedProduct.id ? updatedProduct : p))
        setEditingProduct(null)
        toast({
          title: "تم بنجاح",
          description: "تم تحديث المنتج",
        })
      } catch (error) {
        console.error('Error updating product:', error)
        toast({
          title: "خطأ",
          description: "فشل في تحديث المنتج",
          variant: "destructive",
        })
      }
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setInventory(inventory.filter(p => p.id !== productId))
      toast({
        title: "تم بنجاح",
        description: "تم حذف المنتج",
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "خطأ",
        description: "فشل في حذف المنتج",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value })
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">إدارة المخازن</h1>
      
      <div className="mb-4">
        <Select value={selectedWarehouse || ''} onValueChange={setSelectedWarehouse}>
          <SelectTrigger>
            <SelectValue placeholder="اختر المخزن" />
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 mb-4">
        <Dialog open={isAddWarehouseModalOpen} onOpenChange={setIsAddWarehouseModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" /> إضافة مخزن جديد</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مخزن جديد</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">اسم المخزن</Label>
                <Input
                  id="name"
                  value={newWarehouseName}
                  onChange={(e) => setNewWarehouseName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addWarehouse}>إضافة</Button>
          </DialogContent>
        </Dialog>
        
        {selectedWarehouse && (
          <Button variant="destructive" onClick={deleteWarehouse}>
            <Trash2 className="mr-2" /> حذف المخزن المحدد
          </Button>
        )}
      </div>

      {selectedWarehouse && (
        <>
          <h2 className="text-xl font-semibold mb-2">المنتجات في المخزن المحدد</h2>
          <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2" /> إضافة منتج جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productName" className="text-right">اسم المنتج</Label>
                  <Input
                    id="productName"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productCode" className="text-right">كود المنتج</Label>
                  <Input
                    id="productCode"
                    name="code"
                    value={newProduct.code}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productQuantity" className="text-right">الكمية</Label>
                  <Input
                    id="productQuantity"
                    name="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productPrice" className="text-right">سعر البيع</Label>
                  <Input
                    id="productPrice"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productPurchasePrice" className="text-right">سعر الشراء</Label>
                  <Input
                    id="productPurchasePrice"
                    name="purchasePrice"
                    type="number"
                    value={newProduct.purchasePrice}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productExpiryDate" className="text-right">تاريخ الانتهاء</Label>
                  <Input
                    id="productExpiryDate"
                    name="expiryDate"
                    type="date"
                    value={newProduct.expiryDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={addProduct}>إضافة</Button>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المنتج</TableHead>
                <TableHead>الكود</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>سعر البيع</TableHead>
                <TableHead>سعر الشراء</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory
                .filter(product => product.warehouseId === selectedWarehouse)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.purchasePrice}</TableCell>
                    <TableCell>{product.expiryDate}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {editingProduct && (
            <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تعديل المنتج</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductName" className="text-right">اسم المنتج</Label>
                    <Input
                      id="editProductName"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductCode" className="text-right">كود المنتج</Label>
                    <Input
                      id="editProductCode"
                      name="code"
                      value={editingProduct.code}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductQuantity" className="text-right">الكمية</Label>
                    <Input
                      id="editProductQuantity"
                      name="quantity"
                      type="number"
                      value={editingProduct.quantity}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductPrice" className="text-right">سعر البيع</Label>
                    <Input
                      id="editProductPrice"
                      name="price"
                      type="number"
                      value={editingProduct.price}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductPurchasePrice" className="text-right">سعر الشراء</Label>
                    <Input
                      id="editProductPurchasePrice"
                      name="purchasePrice"
                      type="number"
                      value={editingProduct.purchasePrice}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductExpiryDate" className="text-right">تاريخ الانتهاء</Label>
                    <Input
                      id="editProductExpiryDate"
                      name="expiryDate"
                      type="date"
                      value={editingProduct.expiryDate}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={updateProduct}>حفظ التغييرات</Button>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  )
}

