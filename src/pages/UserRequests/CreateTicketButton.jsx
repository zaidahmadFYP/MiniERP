import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)({
  backgroundColor: '#f15a22',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#d14e1d',
  },
});

const CreateTicketButton = ({ onClick }) => {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      Create Ticket
    </CustomButton>
  );
};

export default CreateTicketButton;
