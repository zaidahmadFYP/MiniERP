import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchBar from '../SearchBar/SearchBar';
import ProfileMenu from './ProfileMenu'; // Import the ProfileMenu component
import { Link } from 'react-router-dom';
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
  user = { name: 'John Doe', email: 'johndoe@example.com', role: 'Admin', branch: 'New York' },
}) => {
  const [jumping, setJumping] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [drawerRotating, setDrawerRotating] = useState(false); 
  const [highlightedIcon, setHighlightedIcon] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // For Profile Menu

  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setHighlightedIcon('account');
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    setHighlightedIcon(null);
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
              handleDrawerToggle();
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
            className={`${highlightedIcon === 'account' ? 'highlighted' : ''}`}
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

        {/* Use ProfileMenu component */}
        <ProfileMenu
          anchorEl={profileAnchorEl}
          isOpen={isProfileMenuOpen}
          onClose={handleMenuClose}
          user={user}
          darkMode={darkMode}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
