'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReceiptIcon as CashRegister, DollarSign } from 'lucide-react'

interface POSTerminal {
  id: string;
  name: string;
  initialFloat: number;
  currentBalance: number;
  lastUpdated: string;
}

export function POSManagement() {
  const [terminals, setTerminals] = useState<POSTerminal[]>([]);
  const [isAddTerminalModalOpen, setIsAddTerminalModalOpen] = useState(false);
  const [newTerminal, setNewTerminal] = useState({ name: '', initialFloat: 0 });
  const [isCollectFundsModalOpen, setIsCollectFundsModalOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<POSTerminal | null>(null);
  const [collectedAmount, setCollectedAmount] = useState(0);

  useEffect(() => {
    // في تطبيق حقيقي، ستقوم بجلب هذه البيانات من الخادم
    const sampleTerminals: POSTerminal[] = [
      { id: '1', name: 'نقطة البيع 1', initialFloat: 1000, currentBalance: 1500, lastUpdated: '2023-06-15 10:00' },
      { id: '2', name: 'نقطة البيع 2', initialFloat: 800, currentBalance: 1200, lastUpdated: '2023-06-15 09:30' },
    ];
    setTerminals(sampleTerminals);
  }, []);

  const handleAddTerminal = () => {
    const newTerminalWithId: POSTerminal = {
      id: Date.now().toString(),
      name: newTerminal.name,
      initialFloat: newTerminal.initialFloat,
      currentBalance: newTerminal.initialFloat,
      lastUpdated: new Date().toLocaleString('ar-EG'),
    };
    setTerminals([...terminals, newTerminalWithId]);
    setNewTerminal({ name: '', initialFloat: 0 });
    setIsAddTerminalModalOpen(false);
  };

  const handleCollectFunds = () => {
    if (selectedTerminal) {
      const updatedTerminals = terminals.map(terminal => 
        terminal.id === selectedTerminal.id 
          ? { ...terminal, currentBalance: terminal.currentBalance - collectedAmount, lastUpdated: new Date().toLocaleString('ar-EG') }
          : terminal
      );
      setTerminals(updatedTerminals);
      setSelectedTerminal(null);
      setCollectedAmount(0);
      setIsCollectFundsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة نقاط البيع</h1>
        <Button onClick={() => setIsAddTerminalModalOpen(true)}>
          <CashRegister className="mr-2 h-4 w-4" />
          إضافة نقطة بيع جديدة
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم نقطة البيع</TableHead>
            <TableHead>المبلغ الافتتاحي</TableHead>
            <TableHead>الرصيد الحالي</TableHead>
            <TableHead>آخر تحديث</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terminals.map((terminal) => (
            <TableRow key={terminal.id}>
              <TableCell>{terminal.name}</TableCell>
              <TableCell>{terminal.initialFloat} ريال</TableCell>
              <TableCell>{terminal.currentBalance} ريال</TableCell>
              <TableCell>{terminal.lastUpdated}</TableCell>
              <TableCell>
                <Button onClick={() => {
                  setSelectedTerminal(terminal);
                  setIsCollectFundsModalOpen(true);
                }}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  تحصيل الأموال
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddTerminalModalOpen} onOpenChange={setIsAddTerminalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نقطة بيع جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="terminalName">اسم نقطة البيع</Label>
              <Input
                id="terminalName"
                value={newTerminal.name}
                onChange={(e) => setNewTerminal({ ...newTerminal, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="initialFloat">المبلغ الافتتاحي</Label>
              <Input
                id="initialFloat"
                type="number"
                value={newTerminal.initialFloat}
                onChange={(e) => setNewTerminal({ ...newTerminal, initialFloat: Number(e.target.value) })}
              />
            </div>
            <Button onClick={handleAddTerminal}>إضافة نقطة البيع</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCollectFundsModalOpen} onOpenChange={setIsCollectFundsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحصيل الأموال من {selectedTerminal?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="collectedAmount">المبلغ المحصل</Label>
              <Input
                id="collectedAmount"
                type="number"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleCollectFunds}>تأكيد التحصيل</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

