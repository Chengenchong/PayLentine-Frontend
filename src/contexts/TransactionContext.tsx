"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Transaction = {
  id: string;
  type: string;
  user: string;
  amount: string;
  date: string;
  positive: boolean;
};

const initialTransactions: Transaction[] = [
  {
    id: '900000289',
    type: 'Receiving money',
    user: 'Bruno Hoffman',
    amount: '+$300',
    date: '2020-05-24',
    positive: true,
  },
  {
    id: '900000288',
    type: 'Receiving money',
    user: 'Vanessa Saldia',
    amount: '+$400',
    date: '2020-05-24',
    positive: true,
  },
  {
    id: '900000287',
    type: 'Receiving money',
    user: 'Chad Kenley',
    amount: '-$180',
    date: '2020-05-24',
    positive: false,
  },
  {
    id: '900000286',
    type: 'Receiving money',
    user: 'Manuel Rovira',
    amount: '+$260',
    date: '2020-04-20',
    positive: true,
  },
];

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within a TransactionProvider');
  return context;
}; 