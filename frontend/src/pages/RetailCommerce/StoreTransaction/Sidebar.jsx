import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const Sidebar = ({ user }) => {
  return (
    <Box
      sx={{
        width: '250px',
        backgroundColor: '#f4f4f4',
        padding: '10px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Store Info
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Store: {user?.store}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Branch: {user?.branch}
      </Typography>
    </Box>
  );
};

export default Sidebar;