import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';
import Adjuster from './Adjuster';
import TransactionTable from './TransactionTable';
import MainContentWrapper from './MainContentWrapper';

const StoreTransaction = ({ open, user }) => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([
    { date: '2/3/2025', amount: '$50', purpose: 'Dine In' },
    { date: '2/3/2025', amount: '$30', purpose: 'Take Away' },
    { date: '2/3/2025', amount: '$70', purpose: 'Delivery' },
  ]);
  const [tableWidth, setTableWidth] = useState(800);

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