import React from 'react';
import { Menu, MenuItem, Avatar, Typography, Box, Divider } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ProfileMenu = ({ anchorEl, isOpen, onClose, user, darkMode }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        style: {
          width: 320,
          padding: '25px',
          borderRadius: '16px',
          backgroundColor: darkMode ? '#2c2c2c' : '#fefefe',
          color: darkMode ? '#e0e0e0' : '#333',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {/* Profile Avatar with Gradient */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar sx={{ 
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
          width: 64, 
          height: 64, 
          fontSize: '1.5rem',
          color: '#fff'
        }}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      </Box>
      
      {/* User Name and Email */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkMode ? '#e0e0e0' : '#333', mb: 1 }}>
        {user.name || 'User Name'}
      </Typography>
      <Typography variant="body2" sx={{ color: darkMode ? '#bdbdbd' : '#666', mb: 2 }}>
        {user.email || 'email@example.com'}
      </Typography>

      {/* Divider for better section separation */}
      <Divider sx={{ my: 2, backgroundColor: darkMode ? '#424242' : '#e0e0e0' }} />

      {/* Role and Branch Details with Prominent Text and Icons */}
      <Box display="flex" flexDirection="column" alignItems="center">
        <MenuItem disabled sx={{ padding: 0, color: darkMode ? '#c5cae9' : '#444', display: 'flex', alignItems: 'center', mb: 1 }}>
          <WorkIcon fontSize="small" sx={{ mr: 1, color: darkMode ? '#90caf9' : '#1e88e5' }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: darkMode ? '#c5cae9' : '#444' }}>
            Role: <span style={{ fontWeight: 'normal', color: darkMode ? '#e8eaf6' : '#555' }}>{user.role || 'N/A'}</span>
          </Typography>
        </MenuItem>
        <MenuItem disabled sx={{ padding: 0, color: darkMode ? '#c5cae9' : '#444', display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: darkMode ? '#90caf9' : '#1e88e5' }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: darkMode ? '#c5cae9' : '#444' }}>
            Branch: <span style={{ fontWeight: 'normal', color: darkMode ? '#e8eaf6' : '#555' }}>{user.branch || 'N/A'}</span>
          </Typography>
        </MenuItem>
      </Box>
    </Menu>
  );
};

export default ProfileMenu;
