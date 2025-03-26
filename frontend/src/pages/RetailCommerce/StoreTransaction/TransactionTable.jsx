import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';
import Adjuster from './Adjuster';
import TransactionTable from './TransactionTable';
import MainContentWrapper from './MainContentWrapper';

const StoreTransaction = ({ open, user }) => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]); // Store transactions
  const [tableWidth, setTableWidth] = useState(800); // Adjust table width

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/transactions`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(); // Fetch transactions when component mounts
  }, [fetchTransactions]);

  const handleResize = (newWidth) => {
    setTableWidth(newWidth);
  };

  return (
    <MainContentWrapper open={open}>
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Adjuster */}
      <Adjuster onResize={handleResize} />
      
      {/* Main Content */}
      <TransactionTable transactions={transactions} tableWidth={tableWidth} />
    </MainContentWrapper>
  );
};

export default StoreTransaction;