import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MainContentWrapper from './MainContentWrapper';
import SearchBar from './SearchBar';
import AddFileButton from './AddFileButton';
import FileTable from './FileTable';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HoverPopoverButton from './HoverPopoverButton';
import AddCylinderExpiry from './AddCylinderExpiry';


const ExpiryofCylinders = ({ open, user }) => {


  const theme = useTheme();
  const headingColor = theme.palette.mode === 'dark' ? '#f15a22' : '#000000';
  const [files, setFiles] = useState([]); // State for files
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  // const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialogs
  // const [dialogMessage, setDialogMessage] = useState(''); // State for messages
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // State for delete confirmation dialog
  const [fileToDelete, setFileToDelete] = useState(null); // Store file to delete
  const [loading, setLoading] = useState(false); // State for managing table refresh
  const [zones, setZones] = useState([]); // State for zones
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedZone, setSelectedZone] = useState(user?.role === 'Admin' ? '' : user?.zone); // State for selected zone
  const [selectedBranch, setSelectedBranch] = useState(user?.role === 'Admin' ? '' : user?.branch); // State for selected branch
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State for snackbar severity

  // Supported file types
  // const supportedFileTypes = [
  //   'image/png',
  //   'image/jpeg',
  //   'image/webp',
  //   'application/pdf',
  //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  //   'application/vnd.ms-excel', // .xls
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  //   'text/csv',
  //   'application/txt'
  // ];



  // Fetch zones from the server
  const fetchZones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/zones');
      const zonesData = await response.json();
      setZones(zonesData);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  // Fetch branches for the selected zone
  const fetchBranches = async (zoneName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/zones/${zoneName}/branches`);
      const branchesData = await response.json();
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  // Fetch the files for the specified zone and branch
  const fetchFiles = useCallback(async () => {
    if (!selectedZone || !selectedBranch) return;

    setLoading(true);
    try {
      const encodedZone = encodeURIComponent(selectedZone.trim());
      const encodedBranch = encodeURIComponent(selectedBranch.trim());

      const response = await fetch(`http://localhost:5000/api/files/hse-expiryofcylinders/${encodedZone}/${encodedBranch}`);

      if (response.ok) {
        const filesData = await response.json();
        setFiles(filesData);
      } else if (response.status === 404) {
        console.error('No files found for this zone and branch.');
        setFiles([]);
      } else {
        console.error('Error fetching files:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    setLoading(false);
  }, [selectedZone, selectedBranch]);

  useEffect(() => {
    fetchZones(); // Fetch zones when component mounts
  }, []);

  useEffect(() => {
    if (selectedZone) {
      fetchBranches(selectedZone); // Fetch branches when a zone is selected
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedZone && selectedBranch) {
      fetchFiles(); // Fetch files when component mounts or when zone/branch changes
    }
  }, [selectedZone, selectedBranch, fetchFiles]);

  // Handle file upload
  const handleFileSelect = async (file) => {
    if (file) {
      // Normalize filename to avoid spaces
      const normalizedFileName = file.name.replace(/\s+/g, '_');

      const formData = new FormData();
      formData.append('file', new File([file], normalizedFileName, { type: file.type }));

      try {
        const response = await fetch(`http://localhost:5000/api/files/hse-expiryofcylinders/${encodeURIComponent(selectedZone)}/${encodeURIComponent(selectedBranch)}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          fetchFiles(); // Re-fetch files after upload to update the UI
          setSnackbarMessage(`File "${normalizedFileName}" has been added successfully.`);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setSnackbarOpen(true); // Ensure snackbar triggers after deletion
        } else {
          const errorMessage = await response.text();
          console.error('Error uploading file:', response.statusText, errorMessage);
          setSnackbarMessage('Failed to upload file.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setSnackbarMessage('Failed to upload file.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  // Open confirmation dialog before deletion
  const openDeleteDialog = (filename) => {
    setFileToDelete(filename);
    setConfirmDeleteOpen(true); // Open the delete confirmation dialog
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setConfirmDeleteOpen(false); // Close the confirmation dialog immediately

    const trimmedFilename = fileToDelete.trim();
    const encodedFilename = encodeURIComponent(trimmedFilename);
    const deleteUrl = `http://localhost:5000/api/files/hse-expiryofcylinders/${encodeURIComponent(selectedZone)}/${encodeURIComponent(selectedBranch)}/${encodedFilename}`;

    // Show snackbar right away with success message
    setSnackbarMessage(`File "${trimmedFilename}" is being deleted, Please Click Refresh Icon`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      console.log('DELETE URL:', deleteUrl);  // Debugging log

      const response = await fetch(deleteUrl, { method: 'DELETE' });

      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.filename !== trimmedFilename)
        );

        // Update snackbar to success after delete
        setSnackbarMessage(`File "${trimmedFilename}" has been deleted successfully.`);
        setSnackbarSeverity('success');
      } else {
        const errorMessage = await response.text();
        console.error('Failed to delete file:', response.statusText, errorMessage);

        // Update snackbar to error in case of failure
        setSnackbarMessage('Failed to delete file.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setSnackbarMessage('Error occurred while deleting the file.');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true); // Ensure snackbar opens in all cases
    setFileToDelete(null); // Clear the file to delete after the operation
  };

  // Handle canceling the deletion
  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false); // Close the confirmation dialog
    setFileToDelete(null); // Reset the file to delete
  };

  // Handle Dialog Close
  // const handleDialogClose = () => {
  //   setIsDialogOpen(false);
  // };

  // Handle Snackbar Close
  const handleSnackbarClose = (event, reason) => {
    console.log('Snackbar closed with reason:', reason); // Debugging log
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };



  // Filter files based on search query (filename or fileNumber)
  const filteredFiles = files.filter(file =>
    file?.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file?.fileNumber?.toLowerCase().includes(searchQuery.toLowerCase())  // Added fileNumber to search filter
  );




  return (
    <MainContentWrapper open={open}>
      {/* Heading Section */}
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
        HSE/EXPIRY OF CYLINDERS
      </Typography>


      <Typography
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
          mb: 2,
        }}
      >
        Your Branch: {user?.branch}
      </Typography>

      {user?.role === 'Restaurant Manager' && (
        <Box
          marginBottom={2} // Add margin between the form and the table
          display="flex"
          justifyContent="flex-end" // Align the AddCylinderExpiry to the right (optional, based on your layout)
        >
          <AddCylinderExpiry
          user={user}
            zone={selectedZone}
            branch={selectedBranch}
            fetchFiles={fetchFiles} // Pass the fetchFiles function to refresh the file list after adding a cylinder expiry
            sx={{
              borderRadius: '20px', // Optional: More rounded corners for the AddCylinderExpiry component if needed
              backgroundColor: '#f15a22', // Optional: Background color
            }}
          />
        </Box>
      )}
      {/* Box to contain the search bar, Refresh button, Zone and Branch Select, and Add File button */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
          {user?.role === 'Admin' && (
            <>
              <Grid item xs={3}>
                <FormControl fullWidth>
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
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth>
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
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth>
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search files..."
                    style={{ width: '300px' }}
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                xs={3}
                sx={{
                  padding: 0,
                  textAlign: 'right',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '15px',
                }}
              >
                {/* Conditionally render Add File Button for admin users */}
                <AddFileButton onFileSelect={handleFileSelect} />

                {/* Refresh Icon */}
                <IconButton onClick={fetchFiles} sx={{ color: '#f15a22' }}>
                  <RefreshIcon />
                </IconButton>

                {/* Hover Button with Popover */}
                <HoverPopoverButton />

              </Grid>
            </>
          )}

          {user?.role !== 'Admin' && (
            <>
              <Grid item xs={9}>
                <FormControl fullWidth>
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search files..."
                    style={{ width: '250px' }} // Decreased the size of the search bar
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                xs={3}
                sx={{
                  padding: 0,
                  textAlign: 'right',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '15px',
                }}
              >
                {/* Refresh Icon */}
                <IconButton onClick={fetchFiles} sx={{ color: '#f15a22' }}>
                  <RefreshIcon />
                </IconButton>
              </Grid>
            </>
          )}
        </Grid>

        {/* File Table */}
        <Box
          sx={{
            width: '100%',
            maxHeight: '500px',  // Limit the max height for scrollability
            overflowY: files.length > 5 ? 'scroll' : 'unset',  // Enable scrolling if there are more than 5 files
            backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#fafafa',
            color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          {/* Show loading indicator if files are being refreshed */}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : files.length === 0 ? (
            <Typography>No Files Stored</Typography> // Display this when no files are present
          ) : (
            <FileTable files={filteredFiles} onDelete={openDeleteDialog} user={user} />
          )}
        </Box>
      </Box>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
            color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
          },
        }}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the file "{fileToDelete}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              backgroundColor: '#d14e1d',
              color: '#fff',
              '&:hover': { backgroundColor: '#c43d17' },
            }}
          >
            No
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: '#f15a22',
              color: '#fff',
              '&:hover': { backgroundColor: '#d14e1d' },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for file operations */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </MainContentWrapper>
  );
};

export default ExpiryofCylinders;