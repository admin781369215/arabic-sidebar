'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
}

interface Shift {
  id: string;
  employeeId: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({ name: '', position: '', phone: '' });
  const [newShift, setNewShift] = useState<Omit<Shift, 'id'>>({ employeeId: '', date: new Date(), startTime: '', endTime: '' });
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const sampleEmployees: Employee[] = [
      { id: '1', name: 'محمد أحمد', position: 'كاشير', phone: '0501234567' },
      { id: '2', name: 'فاطمة علي', position: 'مدير مخزون', phone: '0551234567' },
    ];
    setEmployees(sampleEmployees);

    const sampleShifts: Shift[] = [
      { id: '1', employeeId: '1', date: new Date(), startTime: '09:00', endTime: '17:00' },
      { id: '2', employeeId: '2', date: new Date(), startTime: '10:00', endTime: '18:00' },
    ];
    setShifts(sampleShifts);
  }, []);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeWithId: Employee = {
      id: Date.now().toString(),
      ...newEmployee
    };
    setEmployees(prev => [...prev, employeeWithId]);
    setNewEmployee({ name: '', position: '', phone: '' });
    setIsAddEmployeeModalOpen(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsAddEmployeeModalOpen(true);
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp));
      setEditingEmployee(null);
      setIsAddEmployeeModalOpen(false);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setShifts(prev => prev.filter(shift => shift.employeeId !== id));
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const shiftWithId: Shift = {
      id: Date.now().toString(),
      ...newShift,
      date: newShift.date
    };
    setShifts(prev => [...prev, shiftWithId]);
    setNewShift({ employeeId: '', date: new Date(), startTime: '', endTime: '' });
    setIsAddShiftModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الموظفين والمناوبات</h1>
        <div className="space-x-2">
          <Dialog open={isAddShiftModalOpen} onOpenChange={setIsAddShiftModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> إضافة مناوبة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مناوبة جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddShift} className="space-y-4">
                <div>
                  <Label htmlFor="employeeId">الموظف</Label>
                  <Select
                    value={newShift.employeeId}
                    onValueChange={(value) => setNewShift(prev => ({ ...prev, employeeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>التاريخ</Label>
                  <Calendar
                    mode="single"
                    selected={newShift.date}
                    onSelect={(date) => date && setNewShift(prev => ({ ...prev, date }))}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">وقت البدء</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">وقت الانتهاء</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit">إضافة المناوبة</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddEmployeeModalOpen} onOpenChange={setIsAddEmployeeModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> إضافة موظف
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEmployee ? 'تعديل الموظف' : 'إضافة موظف جديد'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee} className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    value={editingEmployee ? editingEmployee.name : newEmployee.name}
                    onChange={(e) => editingEmployee 
                      ? setEditingEmployee({ ...editingEmployee, name: e.target.value })
                      : setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">المنصب</Label>
                  <Input
                    id="position"
                    value={editingEmployee ? editingEmployee.position : newEmployee.position}
                    onChange={(e) => editingEmployee
                      ? setEditingEmployee({ ...editingEmployee, position: e.target.value })
                      : setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={editingEmployee ? editingEmployee.phone : newEmployee.phone}
                    onChange={(e) => editingEmployee
                      ? setEditingEmployee({ ...editingEmployee, phone: e.target.value })
                      : setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit">{editingEmployee ? 'تحديث الموظف' : 'إضافة الموظف'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">قائمة الموظفين</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>المنصب</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditEmployee(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">جدول المناوبات</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>وقت البدء</TableHead>
                <TableHead>وقت الانتهاء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>{employees.find(emp => emp.id === shift.employeeId)?.name}</TableCell>
                  <TableCell>{shift.date.toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

