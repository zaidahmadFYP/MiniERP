import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';

const ToolbarComponent = () => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        {/* Left Side Icons */}
        <IconButton edge="start" color="inherit" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="new">
          <AddIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="delete">
          <DeleteIcon />
        </IconButton>

        {/* Center Section with Buttons */}
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
          <Button>Purchase order</Button>
          <Button>Purchase</Button>
          <Button>Manage</Button>
          <Button>Receive</Button>
          <Button>Invoice</Button>
          <Button>Retail</Button>
          <Button>Warehouse</Button>
          <Button>Transportation</Button>
          <Button>General</Button>
          <Button>Options</Button>
        </Box>

        {/* Right Side Icons */}
        <IconButton color="inherit" aria-label="search">
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="view-module">
          <ViewModuleIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="attach-file">
          <AttachFileIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="refresh">
          <RefreshIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarComponent;
