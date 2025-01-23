'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
// import { ColorPicker } from "@/components/ui/color-picker"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Printer, Upload, Download, Eye } from 'lucide-react'

interface Field {
  id: string;
  name: string;
  enabled: boolean;
}

interface InvoiceTemplate {
  fields: Field[];
  font: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  logo: string | null;
  additionalText: string;
  paperSize: 'A4' | 'A5' | 'receipt';
}

const initialTemplate: InvoiceTemplate = {
  fields: [
    { id: '1', name: 'اسم العميل', enabled: true },
    { id: '2', name: 'التاريخ', enabled: true },
    { id: '3', name: 'رقم الفاتورة', enabled: true },
    { id: '4', name: 'تفاصيل المنتجات', enabled: true },
    { id: '5', name: 'الإجمالي', enabled: true },
    { id: '6', name: 'الضريبة', enabled: true },
    { id: '7', name: 'المجموع الكلي', enabled: true },
  ],
  font: 'Arial',
  fontSize: 12,
  color: '#000000',
  backgroundColor: '#ffffff',
  logo: null,
  additionalText: '',
  paperSize: 'A4',
}

export function PrintSettings() {
  const [activeTab, setActiveTab] = useState('cash_invoice')
  const [templates, setTemplates] = useState({
    cash_invoice: { ...initialTemplate },
    credit_invoice: { ...initialTemplate },
    return_invoice: { ...initialTemplate },
    pos_invoice: { ...initialTemplate },
    purchase_invoice: { ...initialTemplate },
  })

  const handleFieldToggle = (field: Field) => {
    setTemplates(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        fields: prev[activeTab].fields.map(f =>
          f.id === field.id ? { ...f, enabled: !f.enabled } : f
        )
      }
    }))
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const newFields = Array.from(templates[activeTab].fields)
    const [reorderedItem] = newFields.splice(result.source.index, 1)
    newFields.splice(result.destination.index, 0, reorderedItem)

    setTemplates(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        fields: newFields
      }
    }))
  }

  const handleTemplateChange = (key: string, value: any) => {
    setTemplates(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value
      }
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleTemplateChange('logo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const exportTemplate = () => {
    const dataStr = JSON.stringify(templates[activeTab])
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${activeTab}_template.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTemplate = JSON.parse(e.target?.result as string)
          setTemplates(prev => ({
            ...prev,
            [activeTab]: importedTemplate
          }))
        } catch (error) {
          console.error('Error importing template:', error)
          // يمكنك إضافة رسالة خطأ للمستخدم هنا
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">إعدادات الطباعة</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="cash_invoice">فاتورة مبيعات نقدية</TabsTrigger>
          <TabsTrigger value="credit_invoice">فاتورة مبيعات آجلة</TabsTrigger>
          <TabsTrigger value="return_invoice">فاتورة مرتجع</TabsTrigger>
          <TabsTrigger value="pos_invoice">فاتورة نقطة بيع</TabsTrigger>
          <TabsTrigger value="purchase_invoice">فاتورة مشتريات</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>تخصيص تنسيق {activeTab}</CardTitle>
              <CardDescription>قم بتخصيص تنسيق الفاتورة حسب احتياجاتك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">الحقول</h3>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fields">
                      {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                          {templates[activeTab].fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center space-x-2 mb-2"
                                >
                                  <Checkbox
                                    id={`field-${field.id}`}
                                    checked={field.enabled}
                                    onCheckedChange={() => handleFieldToggle(field)}
                                  />
                                  <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">التنسيق</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="font">الخط</Label>
                      <Select
                        value={templates[activeTab].font}
                        onValueChange={(value) => handleTemplateChange('font', value)}
                      >
                        <SelectTrigger id="font">
                          <SelectValue placeholder="اختر الخط" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fontSize">حجم الخط</Label>
                      <Slider
                        id="fontSize"
                        min={8}
                        max={24}
                        step={1}
                        value={[templates[activeTab].fontSize]}
                        onValueChange={(value) => handleTemplateChange('fontSize', value[0])}
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">لون الخط</Label>
                      <Input
                        id="color"
                        type="color"
                        value={templates[activeTab].color}
                        onChange={(e) => handleTemplateChange('color', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="backgroundColor">لون الخلفية</Label>
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={templates[activeTab].backgroundColor}
                        onChange={(e) => handleTemplateChange('backgroundColor', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="logo">شعار الشركة</Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalText">نص إضافي</Label>
                      <Input
                        id="additionalText"
                        value={templates[activeTab].additionalText}
                        onChange={(e) => handleTemplateChange('additionalText', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="paperSize">حجم الورق</Label>
                      <Select
                        value={templates[activeTab].paperSize}
                        onValueChange={(value) => handleTemplateChange('paperSize', value)}
                      >
                        <SelectTrigger id="paperSize">
                          <SelectValue placeholder="اختر حجم الورق" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="A5">A5</SelectItem>
                          <SelectItem value="receipt">إيصال صغير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <div>
                  <Button onClick={exportTemplate} className="mr-2">
                    <Download className="mr-2 h-4 w-4" />
                    تصدير التنسيق
                  </Button>
                  <label htmlFor="import-template">
                    <Button as="span" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      استيراد التنسيق
                    </Button>
                  </label>
                  <Input
                    id="import-template"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={importTemplate}
                  />
                </div>
                <div>
                  <Button className="mr-2">
                    <Eye className="mr-2 h-4 w-4" />
                    معاينة
                  </Button>
                  <Button>
                    <Printer className="mr-2 h-4 w-4" />
                    حفظ التنسيق
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

