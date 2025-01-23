'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import { EnhancedDashboard } from '@/components/EnhancedDashboard'
import { CashInvoiceForm } from '@/components/CashInvoiceForm'
import { CurrencyConverter } from '@/components/CurrencyConverter'
import { ReceiptVoucher } from '@/components/ReceiptVoucher'
import { PaymentVoucher } from '@/components/PaymentVoucher'
import { WarehouseManagement } from '@/components/WarehouseManagement'
import { DetailedPurchaseInvoice } from '@/components/DetailedPurchaseInvoice'
import { OffersManagement } from '@/components/OffersManagement'
import { CashBox } from '@/components/CashBox'
import { Reports } from '@/components/Reports'
import { UserAccountCreation } from '@/components/UserAccountCreation'
import { PriceChecker } from '@/components/PriceChecker'
import { PointOfSale } from '@/components/PointOfSale'
import { InventoryTransfer } from '@/components/InventoryTransfer'
import { StoreDisplay } from '@/components/StoreDisplay'
import { POSManagement } from '@/components/POSManagement'
import { LoginPage } from '@/components/LoginPage'
import { motion } from 'framer-motion'
import { PrintSettings } from '@/components/PrintSettings'
import { toast } from "@/components/ui/use-toast"
import { GlobalProvider } from '../context/GlobalContext';

interface User {
  username: string;
  isMainUser: boolean;
}

export default function Home() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSidebarItemClick = (item: string) => {
    setActiveComponent(item)
  }

  const handleLogin = async (username: string, password: string) => {
    try {
      // In a real application, you would send a request to the server to verify login credentials
      // For now, we'll simulate this with a timeout and a mock response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Simulate a successful login (replace this with actual API call in production)
      if (username === 'admin' && password === 'password') {
        const userData = { username, isMainUser: true };
        const newUser: User = { username: userData.username, isMainUser: userData.isMainUser };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحبًا بك، ${newUser.username}!`,
        });
      } else {
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setActiveComponent(null);
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <GlobalProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar onItemClick={handleSidebarItemClick} user={user} onLogout={handleLogout} />
        <motion.main 
          className="flex-1 p-6 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeComponent === 'الصفحة الرئيسية' && <EnhancedDashboard />}
          {activeComponent === 'فاتورة نقد' && <CashInvoiceForm />}
          {activeComponent === 'سعر الصرف' && <CurrencyConverter />}
          {activeComponent === 'ReceiptVoucher' && <ReceiptVoucher />}
          {activeComponent === 'PaymentVoucher' && <PaymentVoucher />}
          {activeComponent === 'المخازن' && <WarehouseManagement />}
          {(activeComponent === 'فاتورة مشتريات تفصيلية نقد' || activeComponent === 'فاتورة مشتريات تفصيلية آجل') && (
            <DetailedPurchaseInvoice paymentType={activeComponent === 'فاتورة مشتريات تفصيلية نقد' ? 'cash' : 'credit'} />
          )}
          {activeComponent === 'العروض' && <OffersManagement />}
          {(activeComponent === 'الصندوق' || 
            activeComponent === 'عرض الرصيد' || 
            activeComponent === 'الإيداعات والسحوبات' || 
            activeComponent === 'تقرير الصندوق') && <CashBox />}
          {(activeComponent === 'التقارير' || 
            activeComponent === 'تقرير المبيعات' || 
            activeComponent === 'تقرير المشتريات' || 
            activeComponent === 'تقرير المخزون' || 
            activeComponent === 'تقرير الأرباح والخسائر') && <Reports />}
          {activeComponent === 'فتح حساب' && <UserAccountCreation />}
          {activeComponent === 'فحص سعر المنتج' && <PriceChecker />}
          {activeComponent === 'نقطة البيع' && <PointOfSale />}
          {activeComponent === 'نقل المخزون' && <InventoryTransfer />}
          {activeComponent === 'عرض المتجر' && <StoreDisplay />}
          {activeComponent === 'إدارة نقاط البيع' && <POSManagement />}
          {activeComponent === 'إعدادات الطباعة' && <PrintSettings />}
        </motion.main>
      </div>
    </GlobalProvider>
  )
}

