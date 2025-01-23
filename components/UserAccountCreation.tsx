'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { UserPlus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserAccount {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  fullName: string;
  permissions: string[];
}

interface PermissionItem {
  label: string;
  value: string;
  subItems?: PermissionItem[];
}

const permissionItems: PermissionItem[] = [
  { 
    label: "إدخال فاتورة", 
    value: "invoice_entry",
    subItems: [
      { label: "فاتورة نقد", value: "cash_invoice" },
      { label: "فاتورة أجل", value: "credit_invoice" }
    ]
  },
  { 
    label: "إدخال المشتريات", 
    value: "purchase_entry",
    subItems: [
      { label: "مشتريات نقد", value: "cash_purchase" },
      { label: "مشتريات آجل", value: "credit_purchase" }
    ]
  },
  { label: "إدخال الأصناف", value: "item_entry" },
  { 
    label: "إدخال سند", 
    value: "voucher_entry",
    subItems: [
      { label: "سند قبض", value: "receipt_voucher" },
      { label: "سند صرف", value: "payment_voucher" }
    ]
  },
  { 
    label: "مرتجع", 
    value: "returns",
    subItems: [
      { label: "مرتجع نقد", value: "cash_return" },
      { label: "مرتجع آجل", value: "credit_return" }
    ]
  },
  { label: "الصندوق", value: "cash_box" },
  { label: "التقارير", value: "reports" },
  { label: "العروض", value: "offers" },
  { label: "سعر الصرف", value: "exchange_rate" },
  { label: "حفظ قاعدة البيانات", value: "database_backup" },
  { label: "الإعدادات", value: "settings" },
  { label: "فتح حساب", value: "account_creation" }
]

export function UserAccountCreation() {
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState<UserAccount>({
    id: '',
    username: '',
    password: '',
    email: '',
    role: '',
    fullName: '',
    permissions: [],
  });
  const [createdUsers, setCreatedUsers] = useState<UserAccount[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({ ...prev, role: value }));
    if (value === 'pos') {
      toast({
        title: "تنبيه",
        description: "سيتم تقييد الوصول إلى نقطة البيع فقط لهذا المستخدم.",
        variant: "warning",
      });
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setNewUser(prev => {
      let updatedPermissions: string[];
      if (checked) {
        updatedPermissions = [...prev.permissions, permission];
      } else {
        updatedPermissions = prev.permissions.filter(p => p !== permission);
        // Remove sub-permissions if main permission is unchecked
        const item = permissionItems.find(item => item.value === permission);
        if (item && item.subItems) {
          updatedPermissions = updatedPermissions.filter(p => !item.subItems?.some(sub => sub.value === p));
        }
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userWithId = { ...newUser, id: Date.now().toString() };
    setCreatedUsers(prev => [...prev, userWithId]);
    toast({
      title: "تم إنشاء الحساب",
      description: `تم إنشاء حساب جديد لـ ${userWithId.username} بنجاح.`,
    });
    setNewUser({
      id: '',
      username: '',
      password: '',
      email: '',
      role: '',
      fullName: '',
      permissions: [],
    });
    setIsOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setCreatedUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "تم حذف الحساب",
      description: "تم حذف الحساب بنجاح.",
      variant: "destructive",
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <UserPlus className="mr-2 h-4 w-4" />
            إنشاء حساب مستخدم جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 flex items-center justify-center">
              <UserPlus className="mr-2" />
              إنشاء حساب مستخدم جديد
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                name="fullName"
                value={newUser.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">الدور الوظيفي</Label>
              <Select value={newUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور الوظيفي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="accountant">محاسب</SelectItem>
                  <SelectItem value="sales">مندوب مبيعات</SelectItem>
                  <SelectItem value="inventory">مسؤول مخزون</SelectItem>
                  <SelectItem value="pos">نقطة البيع</SelectItem>
                </SelectContent>
              </Select>
              {newUser.role === 'pos' && (
                <p className="text-sm text-yellow-600 mt-1">
                  ملاحظة: هذا الدور سيقيد الوصول إلى نقطة البيع فقط.
                </p>
              )}
            </div>
            <div>
              <Label>الصلاحيات</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {permissionItems.map((item) => (
                  <div key={item.value} className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={item.value}
                        checked={newUser.permissions.includes(item.value)}
                        onCheckedChange={(checked) => handlePermissionChange(item.value, checked as boolean)}
                      />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                    {item.subItems && newUser.permissions.includes(item.value) && (
                      <div className={`mr-6 mt-1 space-y-1 ${newUser.permissions.includes(item.value) ? '' : 'opacity-50'}`}>
                        {item.subItems.map((subItem) => (
                          <div key={subItem.value} className={`flex items-center space-x-2 ${newUser.permissions.includes(item.value) ? '' : 'opacity-50'}`}>
                            <Checkbox
                              id={subItem.value}
                              checked={newUser.permissions.includes(subItem.value)}
                              onCheckedChange={(checked) => handlePermissionChange(subItem.value, checked as boolean)}
                            />
                            <Label htmlFor={subItem.value} className={newUser.permissions.includes(item.value) ? 'text-gray-900' : 'text-gray-500'}>{subItem.label}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">إنشاء الحساب</Button>
          </form>
        </DialogContent>
      </Dialog>

      {createdUsers.length > 0 && (
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl font-bold">المستخدمون المسجلون</h2>
          {createdUsers.map((user) => (
            <Card key={user.id} className="relative">
              <CardHeader>
                <CardTitle>{user.fullName}</CardTitle>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>اسم المستخدم:</strong> {user.username}</p>
                  <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
                  <p><strong>الدور الوظيفي:</strong> {user.role}</p>
                  <div>
                    <strong>الصلاحيات:</strong>
                    <ul className="list-disc list-inside">
                      {user.permissions.map((permission) => (
                        <li key={permission}>{permissionItems.find(item => item.value === permission)?.label || permission}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

