'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Gift } from 'lucide-react'

interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
}

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
}

export function LoyaltyProgram() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const sampleCustomers: Customer[] = [
      { id: '1', name: 'أحمد محمد', phone: '0501234567', points: 150 },
      { id: '2', name: 'فاطمة علي', phone: '0559876543', points: 75 },
    ];
    setCustomers(sampleCustomers);

    const sampleRewards: Reward[] = [
      { id: '1', name: 'خصم 10%', pointsCost: 100 },
      { id: '2', name: 'هدية مجانية', pointsCost: 200 },
      { id: '3', name: 'قسيمة شراء بقيمة 50 ريال', pointsCost: 500 },
    ];
    setRewards(sampleRewards);
  }, []);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomerWithId: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      points: 0
    };
    setCustomers(prev => [...prev, newCustomerWithId]);
    setNewCustomer({ name: '', phone: '' });
    setIsAddCustomerModalOpen(false);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (selectedCustomer && selectedCustomer.points >= reward.pointsCost) {
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === selectedCustomer.id
            ? { ...customer, points: customer.points - reward.pointsCost }
            : customer
        )
      );
      setSelectedCustomer(prev => prev ? { ...prev, points: prev.points - reward.pointsCost } : null);
      alert(`تم استبدال ${reward.name} بنجاح!`);
      setIsRedeemModalOpen(false);
    } else {
      alert('نقاط غير كافية لاستبدال هذه المكافأة');
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">برنامج الولاء</h1>
        <Dialog open={isAddCustomerModalOpen} onOpenChange={setIsAddCustomerModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit">إضافة العميل</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>النقاط</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.points}</TableCell>
              <TableCell>
                <Button onClick={() => {
                  setSelectedCustomer(customer);
                  setIsRedeemModalOpen(true);
                }}>
                  <Gift className="mr-2 h-4 w-4" />
                  استبدال النقاط
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>استبدال النقاط</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <p>نقاط {selectedCustomer.name}: {selectedCustomer.points}</p>
              <h3 className="text-lg font-semibold">المكافآت المتاحة:</h3>
              <ul className="space-y-2">
                {rewards.map((reward) => (
                  <li key={reward.id} className="flex justify-between items-center">
                    <span>{reward.name} ({reward.pointsCost} نقطة)</span>
                    <Button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={selectedCustomer.points < reward.pointsCost}
                    >
                      استبدال
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

