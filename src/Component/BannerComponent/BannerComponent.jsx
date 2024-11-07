import React from 'react';
import Box from '@mui/material/Box';

const Banner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: -5,
        ml: 6,
        mr: -1,
        padding: 6,
        // boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', 
      }}
    >
      <img
        src="/images/muawin_banner.jpg"
        alt="Banner"
        style={{
          width: '110%',
          height: '100%',
          marginBottom: '1px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', 
          borderRadius: '10px',
        }}
      />
    </Box>
  );
};

export default Banner;
