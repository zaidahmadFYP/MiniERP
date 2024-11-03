import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const Tile = ({ name, image }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const handleClick = () => {
    switch (name) {
      case 'Licenses':
        navigate('/Licenses/Licensepage');
        break;
      case 'Approvals':
        navigate('/Approval/Approvalpage');
        break;
      case 'Vehicles':
        navigate('/Vehicles/Vehiclepage');
        break;
      case 'User Requests':
        navigate('/UserRequests');
        break;
      case 'Health Safety Environment':
        navigate('/Hse/Hse');
        break;
      case 'Taxation':
        navigate('/Taxation/Taxationpage');
        break;
      case 'Certificates':
        navigate('/Certificate/Certificatepage');
        break;
      case 'Security':
        navigate('/Security/GuardTraining');
        break;
      case 'Admin Policies and SOPs':
        navigate('/AdminPolicies');
        break;
      case 'Rental Agreements':
        navigate('/RentalAgreements');
        break;
      case 'User Management':
        navigate('/UserManagement');
        break;
      default:
        console.log(`${name} clicked`);
    }
  };

  return (
    <Tooltip title={name} arrow enterDelay={900} placement="top">
      <Paper
        sx={{
          padding: 1,
          cursor: 'pointer',
          transition: 'transform 0.1s ease-in-out',
          position: 'relative',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          justifyContent: 'flex-start',
          borderRadius: '10px',
          backgroundColor: isDarkMode ? '#333' : '#FFF',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 2,
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: '40px',
              height: '40px',
              marginRight: '15px',
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: '15px',
              fontWeight: 'bold',
              fontFamily: 'Encode Sans',
              color: isDarkMode ? '#FFF' : '#000',
            }}
          >
            {name}
          </Typography>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default Tile;
