import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const EditAssignedModulesDrawer = ({ open, onClose, user, onModulesUpdated }) => {
  const [modules, setModules] = useState([]);
  const [checkedModules, setCheckedModules] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar

  useEffect(() => {
    setModules([
      { main: 'Licenses', subModules: ['Trade Licenses', 'Staff Medicals', 'Tourism Licenses', 'Labour Licenses'] },
      { main: 'Approvals', subModules: ['Outer Spaces'] },
      { main: 'Vehicles', subModules: ['Maintenance', 'Token Taxes', 'Route Permits'] },
      { main: 'Health Safety Environment', subModules: ['Monthly Inspection', 'Quarterly Audit', 'Expiry of Cylinders', 'Incidents', 'Training Status'] },
      { main: 'Taxation', subModules: ['Marketing / Bill Boards Taxes', 'Profession Tax'] },
      { main: 'Certificates', subModules: ['Electric Fitness Test'] },
      { main: 'Security', subModules: ['Guard Training'] },
      { main: 'User Requests', subModules: [] },
      { main: 'Admin Policies and SOPs', subModules: [] },
      { main: 'Rental Agreements', subModules: [] },
      { main: 'User Management', subModules: [] },
    ]);

    if (user && user.registeredModules) {
      const userModules = {};
      user.registeredModules.forEach((module) => {
        userModules[module] = true;
      });
      setCheckedModules(userModules);
    }
  }, [user]);

  const handleModuleChange = (main, sub) => (event) => {
    const key = `${main}_${sub}`;
    setCheckedModules({
      ...checkedModules,
      [key]: event.target.checked,
    });
  };

  const handleSave = async () => {
    if (!user || !user._id) {
      console.error('User ID is missing.');
      return;
    }

    const selectedModules = Object.keys(checkedModules).filter((key) => checkedModules[key]);
    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}/modules`, {
        modules: selectedModules,
      });
      setSnackbarOpen(true); // Show Snackbar on successful update
      onModulesUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating modules:', error.response || error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  const renderModuleSelection = () => {
    const moduleHeight = 56; // Fixed height for consistent styling

    return (
      <Box
        sx={{
          height: '400px',
          overflowY: 'auto',
          paddingRight: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#f15a22',
            borderRadius: '10px',
          },
        }}
      >
        {modules.map((module) =>
          module.subModules.length > 0 ? (
            // Expandable modules
            <Accordion
              key={module.main}
              sx={{
                marginBottom: '4px', // Reduced gap between accordions
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: moduleHeight,
                  '&.MuiAccordionSummary-root': {
                    alignItems: 'center',
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                }}
              >
                <Typography>{module.main}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {module.subModules.map((subModule) => (
                    <FormControlLabel
                      key={subModule}
                      control={
                        <Checkbox
                          checked={!!checkedModules[`${module.main}_${subModule}`]}
                          onChange={handleModuleChange(module.main, subModule)}
                          sx={{
                            color: '#f15a22',
                            '&.Mui-checked': {
                              color: '#f15a22', // Checkbox color when checked
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: '#fff' }}>{subModule}</Typography>}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ) : (
            // Non-expandable modules
            <Box
              key={module.main}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                borderRadius: '4px',
                backgroundColor: '#1c1c1c',
                height: moduleHeight,
                marginBottom: '4px', // Reduced gap for non-expandable modules
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkedModules[`${module.main}_`]}
                    onChange={handleModuleChange(module.main, '')}
                    sx={{
                      color: '#f15a22',
                      '&.Mui-checked': {
                        color: '#f15a22', // Checkbox color when checked
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: '#fff' }}>{module.main}</Typography>}
              />
            </Box>
          )
        )}
      </Box>
    );
  };


  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: '40%', marginTop: '64px' } }}
      >
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Edit Assigned Modules
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {renderModuleSelection()}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button onClick={onClose} sx={{
              mr: 2, color: 'red', borderColor: 'red', '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'red',
              },
            }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#f15a22' }}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Modules updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditAssignedModulesDrawer;
