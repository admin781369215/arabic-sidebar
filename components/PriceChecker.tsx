'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Barcode, Search, ShoppingCart } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  stock: number;
}

// This is a mock function to simulate fetching product data
// In a real application, this would be replaced with an actual API call
const fetchProductData = async (query: string): Promise<Product[]> => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  const products: Product[] = [
    { id: '1', name: 'منتج أ', price: 10.99, barcode: '123456', stock: 50 },
    { id: '2', name: 'منتج ب', price: 15.50, barcode: '789012', stock: 30 },
    { id: '3', name: 'منتج ج', price: 5.75, barcode: '345678', stock: 100 },
    { id: '4', name: 'منتج د', price: 20.00, barcode: '901234', stock: 25 },
  ];
  
  return products.filter(p => 
    p.name.includes(query) || p.barcode.includes(query)
  );
};

export function PriceChecker() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (query.length > 2) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');

    try {
      const results = await fetchProductData(query);
      setProducts(results);
      if (results.length === 0) {
        setError('لم يتم العثور على منتجات');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث عن المنتجات');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1
    }));
    toast({
      title: "تمت الإضافة إلى السلة",
      description: "تمت إضافة المنتج إلى سلة التسوق",
    });
  };

  const getTotalPrice = () => {
    return products.reduce((total, product) => {
      return total + (cart[product.id] || 0) * product.price;
    }, 0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 flex items-center justify-center">
        <Barcode className="mr-2" />
        فحص سعر المنتج
      </h1>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Label htmlFor="query">ابحث عن منتج (بالاسم أو الباركود)</Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اسم المنتج أو الباركود"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading} className="mt-auto">
            <Search className="mr-2 h-4 w-4" /> بحث
          </Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {products.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المنتج</TableHead>
                <TableHead>الباركود</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>إضافة للسلة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.price.toFixed(2)} ريال</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button onClick={() => addToCart(product.id)}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> إضافة
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {Object.keys(cart).length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-semibold mb-2">سلة التسوق</h2>
            <ul>
              {products.filter(p => cart[p.id]).map(product => (
                <li key={product.id} className="flex justify-between">
                  <span>{product.name}</span>
                  <span>{cart[product.id]} x {product.price.toFixed(2)} ريال</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-bold">
              الإجمالي: {getTotalPrice().toFixed(2)} ريال
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

