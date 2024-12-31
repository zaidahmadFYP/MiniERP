import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';

const Roles = [ 
  'IT', 'Admin', 'HR', 'Operations', 'Training and Development',
  'Maintainance', 'Warehouse - Humik',
  'Warehouse - Construction', 'Purchase', 'Surveillance', 'Finance'
];

const branchRoles = ['Restaurant Manager'];

const EditUserDrawer = ({ open, onClose, user, onUserUpdated }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    role: '',
    branch: '',
    zone: ''
  });
  const [zones, setZones] = useState([]);
  const [branches, setBranches] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [drawerCloseNotificationOpen, setDrawerCloseNotificationOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const [firstName, lastName] = user.name ? user.name.split(' ') : ['', ''];
      setFormValues({
        firstName: firstName || '',
        lastName: lastName || '',
        displayName: user.displayName || '',
        email: user.email || '',
        role: user.role || '',
        branch: user.branch || '',
        zone: user.zone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (formValues.zone) {
      fetchBranches(formValues.zone);
    }
  }, [formValues.zone]);

  // Fetch zones from the server
  const fetchZones = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/zones`);
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  // Fetch branches for the selected zone
  const fetchBranches = async (zoneName) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/zones/${zoneName}/branches`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => {
      const updatedValues = { ...prev, [name]: value };

      // Automatically update the displayName based on firstName and lastName
      if (name === 'firstName' || name === 'lastName') {
        updatedValues.displayName = `${updatedValues.firstName} ${updatedValues.lastName}`.trim();
      }

      // If zone is updated, branch should be reset
      if (name === 'zone') {
        updatedValues.branch = '';
      }

      return updatedValues;
    });

    if (name === 'zone') {
      fetchBranches(value);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    const name = `${formValues.firstName} ${formValues.lastName}`.trim();
  
    const updatePayload = {
      name,
      displayName: formValues.displayName,
      role: formValues.role,
      branch: formValues.branch,
      zone: formValues.zone,
    };
  
    console.log("Update payload being sent:", updatePayload); // Log payload
  
    try {
      // Use userId directly in the URL path
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${user._id}`, updatePayload);
      console.log('Response from server:', response.data); // Log response
      setNotificationOpen(true); // Show success notification
      setDrawerCloseNotificationOpen(true); // Show snackbar when drawer closes
      onUserUpdated(); // Refresh user list or any other necessary actions
      onClose(); // Close the drawer
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the notification
  };

  const handleDrawerCloseNotificationClose = () => {
    setDrawerCloseNotificationOpen(false); // Close the drawer close notification
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: '40%', marginTop: '64px' } }} // Added marginTop to prevent going under the appbar
      >
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Edit User Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                fullWidth
                name="firstName"
                variant="outlined"
                value={formValues.firstName}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} // Make label persistent
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                fullWidth
                name="lastName"
                variant="outlined"
                value={formValues.lastName}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} // Make label persistent
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Display Name"
                fullWidth
                name="displayName"
                variant="outlined"
                value={formValues.displayName}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} // Make label persistent
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                variant="outlined"
                value={formValues.email}
                onChange={handleInputChange}
                disabled // Assuming email is not editable
                InputLabelProps={{ shrink: true }} // Make label persistent
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel shrink>Role</InputLabel>
                <Select
                  label="Role"
                  fullWidth
                  name="role"
                  variant="outlined"
                  value={formValues.role}
                  onChange={handleInputChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Role' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#f15a22' : '#888',
                          borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'background.default',
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Role
                  </MenuItem>
                  {Roles.concat(branchRoles).map((role) => (
                    <MenuItem key={role} value={role} style={{ color: 'text.primary' }}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel shrink>Zone</InputLabel>
                <Select
                  label="Zone"
                  fullWidth
                  name="zone"
                  variant="outlined"
                  value={formValues.zone}
                  onChange={handleInputChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Zone' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#f15a22' : '#888',
                          borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'background.default',
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Zone
                  </MenuItem>
                  {zones.map((zone) => (
                    <MenuItem key={zone._id} value={zone.zoneName} style={{ color: 'text.primary' }}>
                      {zone.zoneName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel shrink>Branch</InputLabel>
                <Select
                  label="Branch"
                  fullWidth
                  name="branch"
                  variant="outlined"
                  value={formValues.branch}
                  onChange={handleInputChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Branch' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#f15a22' : '#888',
                          borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'background.default',
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {branches.length === 0 ? 'No Branches Available' : 'Select Branch'}
                  </MenuItem>
                  {branches.map((branch, index) => (
                    <MenuItem key={index} value={branch} style={{ color: 'text.primary', fontSize: '16px' }}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
            >
              Save Changes
            </Button>
          </Box>

          {/* Snackbar for notification */}
          <Snackbar
            open={notificationOpen}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%' }}>
              User details updated successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Drawer>
      {/* Snackbar for drawer close notification */}
      <Snackbar
        open={drawerCloseNotificationOpen}
        autoHideDuration={3000}
        onClose={handleDrawerCloseNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleDrawerCloseNotificationClose} severity="info" sx={{ width: '100%' }}>
          User Edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUserDrawer;
