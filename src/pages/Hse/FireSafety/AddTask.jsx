import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios'; // Import Axios

const AddTask = ({ open, onClose, zones = [], onSubmit }) => {
  const theme = useTheme();
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [selectedZone, setSelectedZone] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [uploadToAll, setUploadToAll] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [warningSnackbarOpen, setWarningSnackbarOpen] = useState(false);

  useEffect(() => {
    setTaskName('');
    setDeadline(null);
    setSelectedZone('');
    setSelectedBranch('');
    setUploadToAll(false);
  }, [open]);

  useEffect(() => {
    if (selectedZone) {
      fetchBranches(selectedZone); // Fetch branches when a zone is selected
    } else {
      setBranches([]);
    }
  }, [selectedZone]);

  const fetchBranches = async (zoneName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/zones/${encodeURIComponent(zoneName)}/branches`);
      if (response.ok) {
        const branchesData = await response.json();
        setBranches(branchesData);
      } else {
        console.error('Error fetching branches:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  

  const handleAddTask = async () => {
    console.log('Add Task button clicked');
    if (!taskName || !deadline || (!uploadToAll && (!selectedZone || !selectedBranch))) {
      setWarningSnackbarOpen(true);
      return;
    }
    
    const newTask = {
      taskName,
      date: new Date().toLocaleDateString(),
      deadline,
      zone: uploadToAll ? 'All' : selectedZone,
      branch: uploadToAll ? 'All' : selectedBranch,
    };

    try {
      // Make POST request to add the task
      await axios.post('http://localhost:5000/api/tasks', newTask);
      onSubmit(newTask);
      onClose();
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={() => { onClose(); setSnackbarOpen(true); }}>
        <Box
          sx={{
            width: 400,
            padding: 3,
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 8, // Added margin top to bring the form down from the app bar
          }}
        >
          <Box sx={{ flexGrow: 1 }}>  {/* Box containing form elements */}
            <Typography variant="h5" sx={{ marginBottom: 3 }}>
              Add New Task
            </Typography>

            <TextField
              label="Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              sx={{
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#f15a22',
                  },
                  '&:hover fieldset': {
                    borderColor: '#f15a22',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f15a22',
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: '#f15a22',
                },
              }}
            />

            {/* Zone Selection */}
            <FormControl
              fullWidth
              sx={{
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#f15a22',
                  },
                  '&:hover fieldset': {
                    borderColor: '#f15a22',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f15a22',
                  },
                },
              }}
            >
              <Select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                displayEmpty
                disabled={uploadToAll}
                sx={{
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  '& .MuiSelect-select': {
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select Zone
                </MenuItem>
                {zones.length > 0 && zones.map((zone) => (
                  <MenuItem key={zone.zoneName} value={zone.zoneName}>
                    {zone.zoneName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Branch Selection */}
            <FormControl
              fullWidth
              sx={{
                marginBottom: 3,
              }}
            >
              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                displayEmpty
                disabled={!selectedZone || uploadToAll}
              >
                <MenuItem value="" disabled>
                  Select Branch
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Deadline Picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      marginBottom: 3,
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        color: '#f15a22',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            {/* Checkbox for Upload to All */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={uploadToAll}
                  onChange={(e) => {
                    setUploadToAll(e.target.checked);
                    if (e.target.checked) {
                      setSelectedZone('');
                      setSelectedBranch('');
                    }
                  }}
                  sx={{
                    color: '#f15a22',
                    '&.Mui-checked': {
                      color: '#f15a22',
                    },
                  }}
                />
              }
              label="Upload to all branches and zones"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#f15a22',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#d4531e',
                },
              }}
              onClick={handleAddTask}
            >
              Add Task
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? '#e8f5e9' : '#c8e6c9',
            padding: '8px 16px',
            borderRadius: '4px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              color: '#388e3c',
              marginRight: '8px',
            }}
          />
          <Typography
            sx={{
              color: theme.palette.mode === 'dark' ? '#2e7d32' : '#388e3c',
              marginRight: 'auto',
            }}
          >
            Task added successfully
          </Typography>
          <Button
            onClick={() => setSnackbarOpen(false)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#2e7d32' : '#388e3c',
              padding: 0,
              minWidth: 'unset',
              marginLeft: '8px',
            }}
          >
            ✖
          </Button>
        </Box>
      </Snackbar>

      <Snackbar
        open={warningSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setWarningSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? '#fff3e0' : '#ffe0b2',
            padding: '8px 16px',
            borderRadius: '4px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography
            sx={{
              color: theme.palette.mode === 'dark' ? '#ff9800' : '#f57c00',
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ⚠️ Please fill in all fields.
          </Typography>
          <Button
            onClick={() => setWarningSnackbarOpen(false)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#ff9800' : '#f57c00',
              padding: 0,
              minWidth: 'unset',
              marginLeft: '8px',
            }}
          >
            ✖
          </Button>
        </Box>
      </Snackbar>
    </>
  );
};

export default AddTask;
