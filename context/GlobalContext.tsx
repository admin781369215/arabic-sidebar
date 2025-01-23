import React, { createContext, useContext, useState, useEffect } from 'react';
import prisma from '../lib/prisma';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface GlobalContextType {
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  fetchInventory: () => Promise<void>;
  fetchCashBalance: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [cashBalance, setCashBalance] = useState(0);

  const fetchInventory = async () => {
    const products = await prisma.product.findMany();
    setInventory(products);
  };

  const fetchCashBalance = async () => {
    const transactions = await prisma.transaction.findMany();
    const balance = transactions.reduce((sum, transaction) => {
      return transaction.type === 'deposit' ? sum + transaction.amount : sum - transaction.amount;
    }, 0);
    setCashBalance(balance);
  };

  useEffect(() => {
    fetchInventory();
    fetchCashBalance();
  }, []);

  return (
    <GlobalContext.Provider value={{ inventory, setInventory, cashBalance, setCashBalance, fetchInventory, fetchCashBalance }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

