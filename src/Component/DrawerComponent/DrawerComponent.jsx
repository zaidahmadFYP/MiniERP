import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import DrawerHeader from '../DrawerHeader/DrawerHeader';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7.5)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7.5)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
    overflowX: 'hidden',
  })
);

const DrawerComponent = ({ open, handleDrawerToggle, theme, user }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [openMenu, setOpenMenu] = useState({});
  const navigate = useNavigate();
  const drawerRef = useRef(null); // Reference to the Drawer

  const handleMenuClick = (itemText) => {
    setOpenMenu((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const handleIconClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Helper function to check if user has access to a module or submodule
  const hasAccess = (moduleName, submoduleName = '') => {
    return user?.registeredModules.some((module) => {
      if (submoduleName) {
        // Check both main module and submodule
        return module === `${moduleName}_${submoduleName}`;
      }
      // Check only main module
      return module.startsWith(`${moduleName}_`) || module === moduleName;
    });
  };

  // Items to be displayed in the Drawer
  const items = [
    {
      text: 'Licenses',
      icon: '/images/licenses.webp',
      path: '/Licenses/Licensepage',
      submenu: [
        { text: 'Trade Licenses', path: '/Licenses/Licensepage' },
        { text: 'Staff Medicals', path: '/Licenses/Licensepage' },
        { text: 'Tourism Licenses', path: '/Licenses/Licensepage' },
        { text: 'Labour Licenses', path: '/Licenses/Licensepage' },
      ],
    },
    {
      text: 'Approvals',
      icon: '/images/approved.webp',
      path: '/Approval/Approvalpage',
      submenu: [{ text: 'Outer Spaces', path: '/Approval/Approvalpage' }],
    },
    {
      text: 'Vehicles',
      icon: '/images/vehicle.webp',
      path: '/Vehicles/Vehiclepage',
      submenu: [
        { text: 'Maintenance', path: '/Vehicles/Vehiclepage' },
        { text: 'Token Taxes', path: '/Vehicles/Vehiclepage' },
        { text: 'Route Permits', path: '/Vehicles/Vehiclepage' },
      ],
    },
    {
      text: 'HSE',
      icon: '/images/hse.webp',
      path: '/Hse/Hse',
      submenu: [
        { text: 'Monthly Inspection', path: '/Hse/MonthlyInspection' },
        { text: 'Quarterly Audit', path: '/Hse/QuarterlyAudit' },
        { text: 'Expiry of Cylinders', path: '/Hse/ExpiryofCylinders' },
        { text: 'Training Status', path: '/Hse/Hse/training' },
        { text: 'Incidents', path: '/Hse/Hse/incidents' },
      ],
    },
    {
      text: 'Taxation',
      icon: '/images/taxation.webp',
      path: '/Taxation/Taxationpage',
      submenu: [
        { text: 'Marketing / Bill Boards Taxes', path: '/Taxation/Taxationpage' },
        { text: 'Profession Tax', path: '/Taxation/Taxationpage' },
      ],
    },
    {
      text: 'Certificates',
      icon: '/images/certificate.webp',
      path: '/Certificate/Certificatepage',
      submenu: [{ text: 'Electric Fitness Test', path: '/Certificate/ElectricFitnessTest' }],
    },
    {
      text: 'Security',
      icon: '/images/security.webp',
      path: '/Security/GuardTraining',
    },
    {
      text: 'Admin Policies and SOPs',
      icon: '/images/admin_icon.webp',
      path: '/AdminPolicies',
    },
    {
      text: 'Rental Agreements',
      icon: '/images/rental_agreements.webp',
      path: '/RentalAgreements',
    },
    {
      text: 'User Management',
      icon: '/images/user_management.webp',
      path: '/UserManagement',
    },
    { text: 'User Requests', icon: '/images/user_icon.webp', path: '/UserRequests' },
  ];

  const filteredItems = items.filter((item) => {
    return hasAccess(item.text);
  });

  // Close the drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isOpen) {
        handleDrawerToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleDrawerToggle]);

  return (
    <div ref={drawerRef}>
      <Drawer variant="permanent" open={isOpen}>
        <DrawerHeader open={isOpen} handleDrawerToggle={handleDrawerToggle} theme={theme} />

        <List
          sx={{
            overflowY: 'auto',
            height: 'calc(100vh - 64px)',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
            },
          }}
        >
          {filteredItems.map((item) => (
            <div key={item.text}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <Tooltip title={item.text} placement="right" arrow enterDelay={1500}>
                  <ListItemButton
                    onClick={() => {
                      if (item.submenu) {
                        handleMenuClick(item.text);
                      } else {
                        handleIconClick(item.path);
                      }
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: isOpen ? 'initial' : 'center',
                      px: 2,
                      overflowX: 'hidden',
                    }}
                  >
                    <ListItemIcon
                      onClick={() => handleIconClick(item.path)}
                      sx={{
                        minWidth: 0,
                        mr: isOpen ? 0.5 : 'auto',
                        justifyContent: 'center',
                        padding: '7px',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={item.icon} alt={item.text} style={{ width: 25, height: 25 }} />
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ opacity: isOpen ? 1 : 0 }} />
                    {item.submenu && isOpen && (openMenu[item.text] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              {item.submenu && isOpen && (
                <Collapse in={openMenu[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu
                      .filter((submenuItem) => hasAccess(item.text, submenuItem.text))
                      .map((submenuItem) => (
                        <ListItemButton
                          key={submenuItem.text}
                          sx={{ pl: isOpen ? 4 : 2 }}
                          onClick={() => handleIconClick(submenuItem.path)}
                          style={{ overflowX: 'hidden' }}
                        >
                          <ListItemText primary={submenuItem.text} />
                        </ListItemButton>
                      ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
