import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Drawer,
  Typography,
  Divider,
  Box,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

const EditBranchNameDrawer = ({ open, onClose, onBranchUpdated }) => {
  const [zones, setZones] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [action, setAction] = useState('edit');
  const [newBranchName, setNewBranchName] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Fetch zones on load
  useEffect(() => {
    if (open) {
      fetchZones();
    }
  }, [open]);

  const fetchZones = async () => {
    try {
      const response = await axios.get('/api/zones');
      console.log("Zones API Response:", response.data); // Debugging: Check API response structure
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const handleZoneChange = (event) => {
    const selectedZoneId = event.target.value;
    setSelectedZone(selectedZoneId);

    // Find the branches for the selected zone
    const zone = zones.find((z) => z._id === selectedZoneId);
    setBranches(zone ? zone.branches : []);
    setSelectedBranch('');
  };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
    setNewBranchName(''); // Clear branch name when switching action
  };

  const handleSave = async () => {
    if (action === 'edit' && newBranchName) {
      try {
        await axios.put(`/api/branches/${selectedBranch}`, {
          name: newBranchName,
        });
        onBranchUpdated();
        setNotificationOpen(true);
      } catch (error) {
        console.error('Error updating branch name:', error);
      }
    } else if (action === 'remove') {
      try {
        await axios.delete(`/api/branches/${selectedBranch}`);
        onBranchUpdated();
        setNotificationOpen(true);
      } catch (error) {
        console.error('Error removing branch:', error);
      }
    }
    onClose(); // Close drawer after save
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Edit or Remove Branch Name
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <FormControl component="fieldset">
          <FormLabel component="legend">Select Action</FormLabel>
          <RadioGroup
            row
            value={action}
            onChange={handleActionChange}
          >
            <FormControlLabel value="edit" control={<Radio />} label="Edit" />
            <FormControlLabel value="remove" control={<Radio />} label="Remove" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
          <FormLabel>Select Zone</FormLabel>
          <Select
            value={selectedZone}
            onChange={handleZoneChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a Zone
            </MenuItem>
            {zones && zones.map((zone) => (
              <MenuItem key={zone._id} value={zone._id}>
                {zone.zoneName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Select Branch</FormLabel>
          <Select
            value={selectedBranch}
            onChange={handleBranchChange}
            displayEmpty
            disabled={!selectedZone}
          >
            <MenuItem value="" disabled>
              Select a Branch
            </MenuItem>
            {branches && branches.map((branch, index) => (
              <MenuItem key={index} value={branch}>
                {branch}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {action === 'edit' && (
          <TextField
            label="New Branch Name"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!selectedZone || !selectedBranch || (action === 'edit' && !newBranchName)}
          fullWidth
        >
          {action === 'edit' ? 'Save Changes' : 'Remove Branch'}
        </Button>

        <Snackbar
          open={notificationOpen}
          autoHideDuration={3000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%' }}>
            {action === 'edit' ? 'Branch name updated successfully!' : 'Branch removed successfully!'}
          </Alert>
        </Snackbar>
      </Box>
    </Drawer>
  );
};

export default EditBranchNameDrawer;
