import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MainContentWrapper from './MainContentWrapper';
import Button from '@mui/material/Button';
import AddFileButton from './AddFileButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Popover from '@mui/material/Popover';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Snackbar from '@mui/material/Snackbar';
import AddTask from './AddTask';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';

const FireSafety = ({ user }) => {
  const theme = useTheme();
  const headingColor = theme.palette.mode === 'dark' ? '#f15a22' : '#000000';
  const [tasks, setTasks] = useState([]); // Task list
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurantManagers, setRestaurantManagers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [zones, setZones] = useState([]); // State for zones
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedZone, setSelectedZone] = useState(''); // State for selected zone
  const [selectedBranch, setSelectedBranch] = useState(''); // State for selected branch
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [anchorEl, setAnchorEl] = useState(null); // State for calendar anchor element
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false); // State for Add Task Drawer
  const [originalTasks, setOriginalTasks] = useState([]); // State for storing original tasks

  useEffect(() => {
    fetchZones(); // Load zones
    if (user.role === 'Admin') {
      fetchUsers(); // Load users if admin
    }
  }, [user]);

  useEffect(() => {
    if (selectedZone) {
      fetchBranches(selectedZone); // Fetch branches when a zone is selected
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedZone && selectedBranch) {
      fetchTasks(selectedZone, selectedBranch); // Fetch tasks for selected zone and branch
      fetchFiles(); // Fetch files when zone/branch changes
    }
  }, [selectedZone, selectedBranch]);

  const fetchTasks = async (zone, branch) => {
    if (!zone || !branch) return; // Only fetch tasks if both zone and branch are selected

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tasks?zone=${encodeURIComponent(zone)}&branch=${encodeURIComponent(branch)}`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
        setOriginalTasks(tasksData); // Store the original tasks
      } else {
        console.error('Error fetching tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const fetchFiles = useCallback(async () => {
    if (!selectedZone || !selectedBranch) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/files?zone=${encodeURIComponent(selectedZone)}&branch=${encodeURIComponent(selectedBranch)}`);
      if (response.ok) {
        const filesData = await response.json();
        setFiles(filesData);
      } else {
        console.error('Error fetching files:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    setLoading(false);
  }, [selectedZone, selectedBranch]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const usersData = await response.json();
        const managers = usersData.filter(user => user.role?.trim().toLowerCase() === 'restaurant manager');
        setRestaurantManagers(managers);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/zones');
      if (response.ok) {
        const zonesData = await response.json();
        setZones(zonesData);
      } else {
        console.error('Error fetching zones:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

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

  const handleFileUpload = (file, taskId) => {
    const fileUrl = `/uploads/${file.name}`; // Mock URL after upload
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, action: 'Submitted', fileSubmitted: true, fileUrl } : task
    );
    setTasks(updatedTasks);
  };

  const handleFileDelete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, action: 'Pending', fileSubmitted: false, fileUrl: '' } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddTaskOpen = () => {
    setIsAddTaskOpen(true);
  };

  const handleAddTaskClose = () => {
    setIsAddTaskOpen(false);
  };

  const handleAddTaskSubmit = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setOriginalTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Function to style the action status boxes
  const getStatusBoxStyle = (status) => ({
    backgroundColor: status === 'Submitted' ? '#4CAF50' : status === 'Pending' ? '#FFC107' : '#FF5722',
    color: '#FFF',
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center',
  });

  const buttonStyles = {
    download: {
      backgroundColor: theme.palette.mode === 'dark' ? '#1E88E5' : '#1565C0',
      color: '#FFF',
      padding: '2px 4px',
      borderRadius: '8px',
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#1976D2' : '#0D47A1',
      },
    },
    delete: {
      backgroundColor: '#E53935',
      color: '#FFF',
      padding: '4px 8px',
      borderRadius: '8px',
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#C62828',
      },
    },
  };

  const containerStyles = {
    backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#f5f5f5',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    transition: 'background-color 0.5s, color 0.5s',
    borderRadius: '8px',
    padding: '20px',
  };

  const headerStyles = {
    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e0e0e0',
    borderRadius: '8px',
    padding: '10px 0',
    transition: 'background-color 0.5s',
  };

  const deadlineTextStyles = {
    color: theme.palette.mode === 'dark' ? '#E57373' : '#D32F2F',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAnchorEl(null);
    // Filter tasks based on the selected date
    if (date) {
      const filteredTasks = originalTasks.filter((task) => new Date(task.date).toDateString() === new Date(date).toDateString());
      setTasks(filteredTasks);
    } else {
      setTasks(originalTasks); // Reset to all tasks if no date is selected
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-calendar-popover' : undefined;

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="No users exist currently in the selected branch and zone"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MainContentWrapper>
          <Typography
            variant="h4"
            sx={{
              color: headingColor,
              mb: 4,
              textAlign: 'center',
              fontSize: '30px',
              fontFamily: 'TanseekModernW20',
              borderBottom: '2px solid #ccc',
              paddingBottom: '10px',
            }}
          >
            FIRE SAFETY STATUS
          </Typography>

          {user.role !== 'Admin' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
              {/* Label and IconButton */}
              <Typography variant="body1" sx={{ marginRight: '8px', color: '#000' }}>
                Download Attendance Sheet Template
              </Typography>
              <IconButton
                sx={{
                  backgroundColor: '#f15a22',
                  color: '#FFF',
                  borderRadius: '12px',
                  '&:hover': { backgroundColor: '#d4531e' },
                }}
                href="/path/to/attendance_sheet_template.xlsx" // Set the correct path to the file
                download
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          )}

          {user.role === 'Admin' ? (
            // Admin View
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                  <FormControl fullWidth sx={{ minWidth: '200px', '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f15a22' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f15a22' } }}>
                    <Select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Zone
                      </MenuItem>
                      {zones.map((zone) => (
                        <MenuItem key={zone.zoneName} value={zone.zoneName}>
                          {zone.zoneName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ minWidth: '200px', '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f15a22' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f15a22' } }}>
                    <Select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      displayEmpty
                      disabled={!selectedZone}
                    >
                      <MenuItem value="" disabled>
                        Branch
                      </MenuItem>
                      {branches.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <IconButton sx={{ backgroundColor: '#f15a22', color: '#FFF', borderRadius: '12px', '&:hover': { backgroundColor: '#d4531e' } }} onClick={handleFilterClick}>
                    <FilterAltIcon />
                  </IconButton>
                  <Button variant="contained" sx={{ backgroundColor: '#f15a22', color: '#FFF', borderRadius: '12px', '&:hover': { backgroundColor: '#d4531e' } }} onClick={() => handleDateChange(null)}>
                    Reset
                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <DateCalendar value={selectedDate} onChange={(date) => handleDateChange(date)} />
                  </Popover>
                  <Button variant="contained" sx={{ backgroundColor: '#f15a22', color: '#FFF', borderRadius: '12px', '&:hover': { backgroundColor: '#d4531e' } }} onClick={handleAddTaskOpen}>Add New Task</Button>
                </Box>
              </Box>
              <Box sx={containerStyles}>
                <Box sx={headerStyles}>
                  <Grid container spacing={0} sx={{ textAlign: 'center', fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}>
                    <Grid item xs={3}><Typography>Task Name</Typography></Grid>
                    <Grid item xs={3}><Typography>Task Generated Date</Typography></Grid>
                    <Grid item xs={3}><Typography>Added Submission</Typography></Grid>
                    <Grid item xs={3}><Typography>Date Uploaded</Typography></Grid>
                  </Grid>
                </Box>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <Grid container spacing={0} key={task._id} sx={{ textAlign: 'center', padding: '10px 0', alignItems: 'center' }}>
                      <Grid item xs={3}><Typography>{task.taskName}</Typography></Grid>
                      <Grid item xs={3}><Typography>{task.date}</Typography></Grid>
                      <Grid item xs={3}>
                        {task.fileSubmitted ? (
                          <Button
                            sx={buttonStyles.download}
                            href={task.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Submission
                          </Button>
                        ) : (
                          <Typography>No Submission</Typography>
                        )}
                      </Grid>
                      <Grid item xs={3}><Typography>{task.fileSubmitted ? task.deadline : 'N/A'}</Typography></Grid>
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center', mt: 4 }}>No tasks available for the selected zone and branch.</Typography>
                )}
              </Box>
            </>
          ) : (
            // Restaurant Manager View
            <Box sx={containerStyles}>
              {/* Table Header */}
              <Box sx={headerStyles}>
                <Grid container spacing={0} sx={{ textAlign: 'center', fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}>
                  <Grid item xs={2}><Typography>Serial No.</Typography></Grid>
                  <Grid item xs={4}><Typography>Task Title</Typography></Grid>
                  <Grid item xs={2}><Typography>Added Submission</Typography></Grid>
                  <Grid item xs={2}><Typography>Action</Typography></Grid>
                  <Grid item xs={2}><Typography sx={{ color: deadlineTextStyles.color }}>Deadline</Typography></Grid>
                </Grid>
              </Box>

              {/* Render Tasks */}
              {tasks.length > 0 ? (
                tasks.map((task, index) => {
                  const isDeadlinePassed = new Date(task.deadline) < new Date();
                  return (
                    <Grid container spacing={0} key={task._id} sx={{ textAlign: 'center', padding: '10px 0', alignItems: 'center' }}>
                      <Grid item xs={2}><Typography>{index + 1}</Typography></Grid>
                      <Grid item xs={4}><Typography>{task.taskName}</Typography></Grid>

                      {/* Added Submission (No Submission/Download Submission) */}
                      <Grid item xs={2}>
                        {isDeadlinePassed && !task.fileSubmitted ? (
                          <Typography>No Submission</Typography>
                        ) : task.fileSubmitted ? (
                          <Button
                            sx={buttonStyles.download}
                            href={task.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Submission
                          </Button>
                        ) : (
                          <Typography>No Submission</Typography>
                        )}
                      </Grid>

                      {/* Action (Add File, Delete Submission, Due) */}
                      <Grid item xs={2}>
                        {isDeadlinePassed ? (
                          <Box sx={getStatusBoxStyle('Pending')}>Pending</Box>
                        ) : task.fileSubmitted ? (
                          <Button
                            sx={buttonStyles.delete}
                            onClick={() => handleFileDelete(task._id)}
                          >
                            Delete Submission
                          </Button>
                        ) : (
                          <AddFileButton onFileSelect={(file) => handleFileUpload(file, task._id)} />
                        )}
                      </Grid>

                      {/* Deadline (Made Prominent) */}
                      <Grid item xs={2}>
                        <Typography sx={deadlineTextStyles}>
                          {task.deadline}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <Typography sx={{ textAlign: 'center', mt: 4 }}>No tasks available.</Typography>
              )}
            </Box>
          )}
        </MainContentWrapper>
      </LocalizationProvider>
      <AddTask open={isAddTaskOpen} onClose={handleAddTaskClose} zones={zones} branches={branches} onSubmit={handleAddTaskSubmit} />
    </>
  );
};

export default FireSafety;
