import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';
import SearchBar from '../SearchBar/SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import './AppBarComponent.css';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#f15a22',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
}));

const AppBarComponent = ({
  open,
  handleDrawerToggle,
  darkMode,
  handleDarkModeToggle,
  searchQuery,
  onSearch,
  searchResults,
  user = { name: 'John Doe', email: 'johndoe@example.com', role: 'Admin', branch: 'New York' }, // Example user details
  onLogout,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [drawerRotating, setDrawerRotating] = useState(false); // New state for drawer icon
  const [highlightedIcon, setHighlightedIcon] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For Settings Menu
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // For Profile Menu
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleMenuOpen = (event) => {
    setHighlightedIcon('settings');
    setSpinning(true);
    setAnchorEl(event.currentTarget);
    setTimeout(() => setSpinning(false), 500);
  };

  const handleProfileMenuOpen = (event) => {
    setHighlightedIcon('account');
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setProfileAnchorEl(null);
    setHighlightedIcon(null);
  };

  const handleLogout = () => {
    // Clear any session or local storage
    localStorage.removeItem('token'); // Assuming you are storing a token
    localStorage.removeItem('user');  // Assuming you are storing user info

    // Reset the authentication state if needed (for example, using a Context or Redux)

    // Close the menu and navigate to login
    handleMenuClose();
    onLogout(); 
    navigate('/login', { replace: true }); // Use `replace: true` to prevent going back to the logged-in page
  };

  const triggerAnimation = (setter, icon) => {
    setHighlightedIcon(icon);
    setter(true);
    setTimeout(() => setter(false), 500);
  };

  const handleDarkModeClick = () => {
    setHighlightedIcon('darkMode');
    triggerAnimation(setRotating, 'darkMode');
    handleDarkModeToggle();
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <Tooltip title="Open Menu" placement="bottom" arrow enterDelay={900}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              handleDrawerToggle(); // Ensure drawer toggle is called
              triggerAnimation(setDrawerRotating, 'drawer');
            }}
            edge="start"
            className={`${drawerRotating ? 'scale-up' : ''} ${highlightedIcon === 'drawer' ? 'highlighted' : ''}`}
            sx={{
              marginRight: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <img
              src="/images/dotsmenu.svg"
              alt="Menu Icon"
              style={{
                width: 25,
                height: 25,
                filter: darkMode ? 'invert(0)' : 'invert(1)',
                marginRight: '8px',
              }}
            />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              filter: darkMode ? 'invert(0)' : 'invert(1)',
            }}
          >
            <img
              src="/images/mauwintextlogo.svg"
              alt="Logo"
              style={{ width: 100, height: 'auto', cursor: 'pointer' }}
            />
          </Link>
        </Typography>

        <SearchBar
          searchQuery={searchQuery}
          onSearch={onSearch}
          searchResults={searchResults}
        />
        <Tooltip title="Toggle Dark Mode" placement="bottom" arrow enterDelay={900}>
          <IconButton
            onClick={handleDarkModeClick}
            color="inherit"
            className={`${rotating ? 'fade-rotate' : ''} ${highlightedIcon === 'darkMode' ? 'highlighted' : ''}`}
            sx={{
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications" placement="bottom" arrow enterDelay={900}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={() => triggerAnimation(setJumping, 'notifications')}
            className={`${jumping ? 'jump' : ''} ${highlightedIcon === 'notifications' ? 'highlighted' : ''}`}
            sx={{
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Account" placement="bottom" arrow enterDelay={900}>
          <IconButton
            size="large"
            aria-label="account of current user"
            color="inherit"
            onClick={handleProfileMenuOpen}
            className={`${pulsing ? 'pulse' : ''} ${highlightedIcon === 'account' ? 'highlighted' : ''}`}
            sx={{
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={profileAnchorEl}
          open={isProfileMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              width: 360,
              padding: '15px',
              marginTop: '10px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: darkMode ? '#424242' : '#fff',
              color: darkMode ? '#e0e0e0' : '#000',
              position: 'relative',
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
          sx={{
            '& .MuiPaper-root::before': {
              content: '""',
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: `10px solid ${darkMode ? '#424242' : '#fff'}`,
            },
          }}
        >
          <MenuItem disabled sx={{ color: darkMode ? '#ffffff' : '#000', marginBottom: '10px' }}>
            <strong>Username:</strong> {` ${user.name}`}
          </MenuItem>
          <MenuItem disabled sx={{ color: darkMode ? '#ffffff' : '#000', marginBottom: '10px' }}>
            <strong>Email:</strong> {` ${user.email}`}
          </MenuItem>
          <MenuItem disabled sx={{ color: darkMode ? '#ffffff' : '#000', marginBottom: '10px' }}>
            <strong>Role:</strong> {` ${user.role}`}
          </MenuItem>
          <MenuItem disabled sx={{ color: darkMode ? '#ffffff' : '#000' }}>
            <strong>Branch:</strong> {` ${user.branch}`}
          </MenuItem>
        </Menu>

        <Tooltip title="Settings" placement="bottom" arrow enterDelay={900}>
          <IconButton
            size="large"
            aria-label="settings"
            color="inherit"
            onClick={handleMenuOpen}
            className={`${spinning ? 'spinning' : ''} ${highlightedIcon === 'settings' ? 'highlighted' : ''}`}
            sx={{
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              width: 150,
              padding: '10px',
              marginTop: '10px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: darkMode ? '#424242' : '#fff',
              color: darkMode ? '#e0e0e0' : '#000',
            },
          }}
          sx={{
            '& .MuiPaper-root::before': {
              content: '""',
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: `10px solid ${darkMode ? '#424242' : '#fff'}`,
            },
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{ fontSize: '0.875rem', padding: '6px 12px', justifyContent: 'center', color: darkMode ? '#ffffff' : '#000' }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
