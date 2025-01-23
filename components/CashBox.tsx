'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Plus, Minus, FileText } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGlobalContext } from '../context/GlobalContext';

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  relatedDocument?: string;
}

export function CashBox() {
  // const [balance, setBalance] = useState(0);
  const { cashBalance, setCashBalance } = useGlobalContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'balance' | 'transactions' | 'report'>('balance');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    // In a real application, you would fetch the initial balance and transactions from your backend here
    const initialBalance = 1000; // Example initial balance
    setCashBalance(initialBalance);

    const initialTransactions: Transaction[] = [
      { id: 1, type: 'deposit', amount: 500, description: 'Initial deposit', date: '2023-06-01' },
      { id: 2, type: 'withdrawal', amount: 200, description: 'Office supplies', date: '2023-06-02' },
      { id: 3, type: 'deposit', amount: 1000, description: 'Invoice payment', date: '2023-06-03', relatedDocument: 'INV-001' },
    ];
    setTransactions(initialTransactions);
  }, []);

  const addTransaction = (type: 'deposit' | 'withdrawal', amount: number, description: string, relatedDocument?: string) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      relatedDocument
    };
    setTransactions([newTransaction, ...transactions]);
    setCashBalance(prevBalance => type === 'deposit' ? prevBalance + amount : prevBalance - amount);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, type: 'deposit' | 'withdrawal') => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const description = formData.get('description') as string;
    const relatedDocument = formData.get('relatedDocument') as string;
    addTransaction(type, amount, description, relatedDocument);
    type === 'deposit' ? setIsDepositModalOpen(false) : setIsWithdrawalModalOpen(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!dateRange.start || !dateRange.end) return true;
    return transaction.date >= dateRange.start && transaction.date <= dateRange.end;
  });

  const totalDeposits = filteredTransactions.reduce((sum, transaction) => 
    transaction.type === 'deposit' ? sum + transaction.amount : sum, 0
  );

  const totalWithdrawals = filteredTransactions.reduce((sum, transaction) => 
    transaction.type === 'withdrawal' ? sum + transaction.amount : sum, 0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <CreditCard className="mr-2" />
          الصندوق
        </h1>
        <div className="flex space-x-2">
          <Button onClick={() => setActiveView('balance')} variant={activeView === 'balance' ? 'default' : 'outline'}>عرض الرصيد</Button>
          <Button onClick={() => setActiveView('transactions')} variant={activeView === 'transactions' ? 'default' : 'outline'}>الإيداعات والسحوبات</Button>
          <Button onClick={() => setActiveView('report')} variant={activeView === 'report' ? 'default' : 'outline'}>تقرير الصندوق</Button>
        </div>
      </div>

      {activeView === 'balance' && (
        <div className="text-center">
          <div className="text-3xl font-semibold mb-4">
            الرصيد الحالي: {cashBalance.toFixed(2)} ريال
          </div>
          <div className="flex justify-center space-x-4">
            <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="mr-2" /> إيداع
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إيداع مبلغ</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => handleSubmit(e, 'deposit')}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">المبلغ</Label>
                      <Input id="deposit-amount" name="amount" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="deposit-description">الوصف</Label>
                      <Input id="deposit-description" name="description" required />
                    </div>
                    <div>
                      <Label htmlFor="deposit-related-document">المستند المرتبط (اختياري)</Label>
                      <Input id="deposit-related-document" name="relatedDocument" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="submit">إيداع</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isWithdrawalModalOpen} onOpenChange={setIsWithdrawalModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">
                  <Minus className="mr-2" /> سحب
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>سحب مبلغ</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => handleSubmit(e, 'withdrawal')}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdrawal-amount">المبلغ</Label>
                      <Input id="withdrawal-amount" name="amount" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="withdrawal-description">الوصف</Label>
                      <Input id="withdrawal-description" name="description" required />
                    </div>
                    <div>
                      <Label htmlFor="withdrawal-related-document">المستند المرتبط (اختياري)</Label>
                      <Input id="withdrawal-related-document" name="relatedDocument" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="submit">سحب</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {activeView === 'transactions' && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>المستند المرتبط</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type === 'deposit' ? 'إيداع' : 'سحب'}</TableCell>
                  <TableCell className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toFixed(2)} ريال
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.relatedDocument || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeView === 'report' && (
        <div>
          <div className="mb-4 flex space-x-4">
            <div>
              <Label htmlFor="start-date">من تاريخ</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-date">إلى تاريخ</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-4">
            <p>إجمالي الإيداعات: {totalDeposits.toFixed(2)} ريال</p>
            <p>إجمالي السحوبات: {totalWithdrawals.toFixed(2)} ريال</p>
            <p>الرصيد النهائي: {(totalDeposits - totalWithdrawals).toFixed(2)} ريال</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>المستند المرتبط</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type === 'deposit' ? 'إيداع' : 'سحب'}</TableCell>
                  <TableCell className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toFixed(2)} ريال
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.relatedDocument || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

