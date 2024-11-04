import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Banner from '../BannerComponent/BannerComponent';
import TilesGrid from '../TileGrid/TileGrid';
import TabsComponent from '../TabComponent/TabComponent';
import AnnouncementForm from './AnnouncementForm';
import TaskForm from './TaskForm';

const MainContent = ({ user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const headingColor = theme.palette.mode === 'dark' ? '#f15a22' : '#000000';
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  const tiles = useMemo(() => {
    const allTiles = [
      { name: 'Licenses', image: '/images/licenses.webp' },
      { name: 'Approvals', image: '/images/approved.webp' },
      { name: 'Vehicles', image: '/images/vehicle.webp' },
      { name: 'User Requests', image: '/images/user_icon.webp' },
      { name: 'Health Safety Environment', image: '/images/hse.webp' },
      { name: 'Taxation', image: '/images/taxation.webp' },
      { name: 'Certificates', image: '/images/certificate.webp' },
      { name: 'Security', image: '/images/security.webp' },
      { name: 'Admin Policies and SOPs', image: '/images/admin_icon.webp' },
      { name: 'Rental Agreements', image: '/images/rental_agreements.webp' },
      { name: 'User Management', image: '/images/user_management.webp' },
    ];
    return allTiles.filter((tile) => user.registeredModules.some((module) => module.startsWith(tile.name)));
  }, [user]);

  useEffect(() => {
    fetch('/api/announcements/latest')
      .then((response) => response.json())
      .then((data) => setLatestAnnouncement(data))
      .catch((error) => console.error('Error fetching the latest announcement:', error));
  }, []);

  useEffect(() => {
    console.log("User data in MainContent:", user);
  }, [user]);

  const handleTileClick = (tileName) => {
    const paths = {
      Licenses: '/Licenses/Licensepage',
      Approvals: '/Approval/Approvalpage',
      Vehicles: '/Vehicles/Vehiclepage',
      UserRequests: '/UserRequests/UserRequests',
      'Health Safety Environment': '/Hse/Hse',
      Taxation: '/Taxation/Taxationpage',
      Certificates: '/Certificate/Certificatepage',
      Security: '/Security/GuardTraining',
      'Admin Policies and SOPs': '/AdminPolicies/AdminPolicies',
      'Rental Agreements': '/RentalAgreements/RentalAgreements',
      'User Management': '/UserManagement/UserManagement',
    };
    navigate(paths[tileName], { state: { tileName } });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 4,
        marginLeft: 1,
        transition: 'margin-left 0.1s',
        overflowY: 'auto',
        height: '100vh',
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
      <Banner />
      <Typography
        variant="h4"
        sx={{
          color: headingColor,
          mb: 1,
          textAlign: 'left',
          ml: 6,
          fontSize: '30px',
          fontFamily: 'TanseekModernW20',
        }}
      >
        MODULES
      </Typography>

      <Grid container spacing={0} alignItems="flex-start">
        <Grid item xs={8}>
          <Box sx={{ ml: 6 }}>
            <TilesGrid tiles={tiles} onTileClick={handleTileClick} />
          </Box>
        </Grid>

        <Grid item xs={4}>
          {user.role === 'Admin' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                ml: 10,
                maxWidth: '100%',
              }}
            >
              <Button
                variant="contained"
                className="expanding-button"
                sx={{
                  width: '48%',
                  backgroundColor: '#f15a22',
                  height: '47px',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d14e1f',
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => setShowAnnouncementForm(true)}
              >
                Add Announcement
              </Button>
              <Button
                variant="contained"
                sx={{
                  width: '48%',
                  backgroundColor: '#f15a22',
                  borderRadius: '12px',
                  height: '47px',
                  transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d14e1f',
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => setShowTaskForm(true)}
              >
                Add Task
              </Button>
            </Box>
          )}

          <Box
            sx={{
              ml: 10,
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)',
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
            <TabsComponent
              latestAnnouncement={latestAnnouncement}
              userId={user?._id?.toString()}
              userZone={user?.zone}
              userBranch={user?.branch}
              userEmail={user?.email}
            />
          </Box>
        </Grid>
      </Grid>

      {showAnnouncementForm && <AnnouncementForm onClose={() => setShowAnnouncementForm(false)} user={user} />}

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)} 
          userId={user?._id} 
          userZone={user?.zone} 
          userBranch={user?.branch} 
        />
      )}
    </Box>
  );
};

export default MainContent;