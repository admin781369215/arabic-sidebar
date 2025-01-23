'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, ShoppingBag } from 'lucide-react'

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

interface Purchase {
  id: string;
  supplierId: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id'>>({ name: '', contact: '', phone: '', email: '' });
  const [newPurchase, setNewPurchase] = useState<Omit<Purchase, 'id'>>({ supplierId: '', date: '', amount: 0, status: 'pending' });
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isAddPurchaseModalOpen, setIsAddPurchaseModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const sampleSuppliers: Supplier[] = [
      { id: '1', name: 'شركة الغذاء المتميز', contact: 'أحمد محمد', phone: '0501234567', email: 'ahmed@food.com' },
      { id: '2', name: 'مؤسسة الخضار الطازجة', contact: 'سارة علي', phone: '0551234567', email: 'sara@freshveg.com' },
    ];
    setSuppliers(sampleSuppliers);

    const samplePurchases: Purchase[] = [
      { id: '1', supplierId:'1', date: '2023-06-01', amount: 5000, status: 'completed' },
      { id: '2', supplierId: '2', date: '2023-06-05', amount: 3500, status: 'pending' },
    ];
    setPurchases(samplePurchases);
  }, []);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const supplierWithId: Supplier = {
      id: Date.now().toString(),
      ...newSupplier
    };
    setSuppliers(prev => [...prev, supplierWithId]);
    setNewSupplier({ name: '', contact: '', phone: '', email: '' });
    setIsAddSupplierModalOpen(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsAddSupplierModalOpen(true);
  };

  const handleUpdateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      setSuppliers(prev => prev.map(sup => sup.id === editingSupplier.id ? editingSupplier : sup));
      setEditingSupplier(null);
      setIsAddSupplierModalOpen(false);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(sup => sup.id !== id));
    setPurchases(prev => prev.filter(purchase => purchase.supplierId !== id));
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const purchaseWithId: Purchase = {
      id: Date.now().toString(),
      ...newPurchase
    };
    setPurchases(prev => [...prev, purchaseWithId]);
    setNewPurchase({ supplierId: '', date: '', amount: 0, status: 'pending' });
    setIsAddPurchaseModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الموردين والمشتريات</h1>
        <div className="space-x-2">
          <Dialog open={isAddPurchaseModalOpen} onOpenChange={setIsAddPurchaseModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <ShoppingBag className="mr-2 h-4 w-4" /> إضافة عملية شراء
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة عملية شراء جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPurchase} className="space-y-4">
                <div>
                  <Label htmlFor="supplierId">المورد</Label>
                  <select
                    id="supplierId"
                    value={newPurchase.supplierId}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, supplierId: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">اختر المورد</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPurchase.date}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">المبلغ</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPurchase.amount}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <select
                    id="status"
                    value={newPurchase.status}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, status: e.target.value as 'pending' | 'completed' | 'cancelled' }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="completed">مكتملة</option>
                    <option value="cancelled">ملغاة</option>
                  </select>
                </div>
                <Button type="submit">إضافة عملية الشراء</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddSupplierModalOpen} onOpenChange={setIsAddSupplierModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> إضافة مورد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSupplier ? 'تعديل المورد' : 'إضافة مورد جديد'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier} className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم المورد</Label>
                  <Input
                    id="name"
                    value={editingSupplier ? editingSupplier.name : newSupplier.name}
                    onChange={(e) => editingSupplier 
                      ? setEditingSupplier({ ...editingSupplier, name: e.target.value })
                      : setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact">جهة الاتصال</Label>
                  <Input
                    id="contact"
                    value={editingSupplier ? editingSupplier.contact : newSupplier.contact}
                    onChange={(e) => editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, contact: e.target.value })
                      : setNewSupplier(prev => ({ ...prev, contact: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={editingSupplier ? editingSupplier.phone : newSupplier.phone}
                    onChange={(e) => editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, phone: e.target.value })
                      : setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingSupplier ? editingSupplier.email : newSupplier.email}
                    onChange={(e) => editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, email: e.target.value })
                      : setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit">{editingSupplier ? 'تحديث المورد' : 'إضافة المورد'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">قائمة الموردين</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المورد</TableHead>
                <TableHead>جهة الاتصال</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditSupplier(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">سجل المشتريات</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المورد</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{suppliers.find(sup => sup.id === purchase.supplierId)?.name}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.amount.toFixed(2)} ريال</TableCell>
                  <TableCell>
                    {purchase.status === 'pending' && 'قيد الانتظار'}
                    {purchase.status === 'completed' && 'مكتملة'}
                    {purchase.status === 'cancelled' && 'ملغاة'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

