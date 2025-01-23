'use client'

import { useState } from 'react'
import { Receipt, ShoppingCart, Package, FileText, RotateCcw, Wallet, BarChart2, Tag, DollarSign, Database, Settings, UserPlus, ChevronDown, ChevronUp, ChevronRight, CreditCard, Barcode, Home, Users, ArrowRight, Store, ReceiptIcon as CashRegister, LogOut, Printer } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { toast } from "@/components/ui/use-toast"

interface User {
  username: string;
  isMainUser: boolean;
}

interface SidebarProps {
  onItemClick: (item: string) => void;
  userPermissions?: string[];
  user: User;
  onLogout: () => void;
}

type MenuItem = {
  icon: React.ElementType;
  label: string;
  subItems?: string[];
  color: string;
  permissions: string;
}

export default function Sidebar({ onItemClick, userPermissions = [
  "sales", "purchases", "inventory", "vouchers", "returns", "cashbox", 
  "reports", "offers", "exchange_rate", "currency_options", "database_backup", 
  "settings", "price_check", "user_management", "employee_management",
  "employee_schedules", "employee_salaries", "employee_loans", "employee_leaves", "employee_attendance", "employee_performance", "employee_training", "employee_documents",
  "employee_salaries", "employee_advances", "pos",
  "inventory_transfer",
  "store_display",
  "pos_management",
  "print_settings"
], user, onLogout }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

  const menuItems: MenuItem[] = [
    {
      icon: Home,
      label: "الصفحة الرئيسية",
      color: "text-blue-500",
      permissions: "dashboard"
    },
    { icon: Receipt, label: "فاتورة مبيعات", subItems: ["فاتورة نقد", "فاتورة أجل"], color: "text-blue-500", permissions: "sales" },
    { 
      icon: ShoppingCart, 
      label: "إدخال المشتريات", 
      subItems: [
        "نقد",
        "آجل",
        "فاتورة مشتريات تفصيلية نقد",
        "فاتورة مشتريات تفصيلية آجل"
      ], 
      color: "text-green-500",
      permissions: "purchases"
    },
    { icon: Package, label: "المخازن", color: "text-purple-500", permissions: "inventory" },
    { icon: FileText, label: "إدخال سند", subItems: ["سند قبض", "سند صرف"], color: "text-yellow-500", permissions: "vouchers" },
    { icon: RotateCcw, label: "مرتجع", subItems: ["نقد", "آجل"], color: "text-red-500", permissions: "returns" },
    { icon: CreditCard, label: "الصندوق", subItems: ["عرض الرصيد", "الإيداعات والسحوبات", "تقرير الصندوق"], color: "text-emerald-500", permissions: "cashbox" },
    { 
      icon: BarChart2, 
      label: "التقارير", 
      subItems: ["تقرير المبيعات", "تقرير المشتريات", "تقرير المخزون", "تقرير الأرباح والخسائر"], 
      color: "text-pink-500",
      permissions: "reports"
    },
    { icon: Tag, label: "العروض", color: "text-teal-500", permissions: "offers" },
    { icon: DollarSign, label: "سعر الصرف", color: "text-orange-500", permissions: "exchange_rate" },
    { icon: Settings, label: "خيارات العملة", color: "text-purple-500", permissions: "currency_options" },
    { icon: Database, label: "حفظ قاعدة البيانات", color: "text-cyan-500", permissions: "database_backup" },
    { icon: Settings, label: "الإعدادات", color: "text-gray-500", permissions: "settings" },
    { icon: Printer, label: "إعدادات الطباعة", color: "text-indigo-500", permissions: "print_settings" },
    { icon: Barcode, label: "فحص سعر المنتج", color: "text-indigo-500", permissions: "price_check" },
    { icon: UserPlus, label: "فتح حساب", color: "text-lime-500", permissions: "user_management" },
    {
      icon: Users,
      label: "إدارة الموظفين",
      subItems: [
        "جدول المناوبات",
        "الرواتب",
        "السلف والقروض",
        "الإجازات",
        "الحضور والانصراف",
        "تقييم الأداء",
        "التدريب والتطوير",
        "الوثائق والمستندات"
      ],
      color: "text-cyan-500",
      permissions: "employee_management"
    },
    { icon: CreditCard, label: "نقطة البيع", color: "text-purple-500", permissions: "pos" },
    {
      icon: CashRegister,
      label: "إدارة نقاط البيع",
      color: "text-indigo-500",
      permissions: "pos_management"
    },
    { icon: ArrowRight, label: "نقل المخزون", color: "text-indigo-500", permissions: "inventory_transfer" },
    { icon: Store, label: "عرض المتجر", color: "text-pink-500", permissions: "store_display" },
  ]

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    )
  }

  const handleItemClick = (item: string) => {
    if (item === "سند قبض") {
      onItemClick("ReceiptVoucher");
    } else if (item === "سند صرف") {
      onItemClick("PaymentVoucher");
    } else {
      onItemClick(item);
    }
  };


  return (
    <motion.div 
      className={`relative transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-64' : 'w-12'} h-screen bg-white border-l overflow-y-auto`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-2 text-gray-500 hover:text-gray-700"
        onClick={toggleSidebar}
      >
        <ChevronRight className={`h-4 w-4 transition-transform ${isSidebarVisible ? 'rotate-180' : ''}`} />
      </Button>
      {isSidebarVisible && (
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
            <Home className="mr-2 h-6 w-6 text-blue-500" />
            لوحة التحكم
          </h2>
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">مرحبًا،</p>
            <p className="font-semibold text-gray-800">{user.username}</p>
            {user.isMainUser && <p className="text-xs text-blue-500">المستخدم الرئيسي</p>}
          </div>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-right group",
                    "hover:bg-gray-100",
                    "focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
                    "text-base font-medium text-gray-700",
                    "transition-all duration-200 ease-in-out",
                    expandedItems.includes(item.label) && "bg-gray-100"
                  )}
                  onClick={() => {
                    if (item.subItems) {
                      toggleExpand(item.label)
                    } else {
                      handleItemClick(item.label)
                    }
                  }}
                >
                  {React.createElement(item.icon, { className: `h-5 w-5 ${item.color} transition-all duration-300 ease-in-out transform group-hover:scale-110` })}
                  <span className={`flex-grow font-medium ${isSidebarVisible ? '' : 'hidden'}`}>{item.label}</span>
                  {item.subItems && (
                    expandedItems.includes(item.label) ? <ChevronUp className="h-4 w-4 mr-auto" /> : <ChevronDown className="h-4 w-4 mr-auto" />
                  )}
                </Button>
                {item.subItems && expandedItems.includes(item.label) && (
                  <motion.div 
                    className="mr-6 mt-1 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-right",
                          "hover:bg-gray-100 hover:text-gray-900",
                          "text-sm py-1 font-normal text-gray-600",
                          "transition-all duration-200 ease-in-out"
                        )}
                        onClick={() => handleItemClick(subItem)}
                      >
                        {subItem === "صرف" ? "سند صرف" : subItem === "قبض" ? "سند قبض" : subItem}
                      </Button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-right mt-6 text-red-500 hover:bg-red-100 hover:text-red-700"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="flex-grow font-medium">تسجيل الخروج</span>
          </Button>
        </div>
      )}
    </motion.div>
  )
}

