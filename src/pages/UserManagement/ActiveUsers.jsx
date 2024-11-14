import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Typography,
  Toolbar,
  TextField,
  Divider,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddUserDrawer from './AddUserDrawer';
import AddBranchDrawer from './AddBranchDrawer';
import MainContentWrapper from './MainContentWrapper';
import { useZones } from './ZonesComponent';
import UploadAccounts from './UploadAccounts';
import EditUserDrawer from './EditUserDrawer';
import EditAssignedModulesDrawer from './EditAssignedModulesDrawer';
import EditBranchNameDrawer from './EditBranchNameDrawer';

const ActiveUsers = () => {
  const { zones, addBranch } = useZones();
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [branchDrawerOpen, setBranchDrawerOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [resetSnackbarOpen, setResetSnackbarOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState('');

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editModulesDrawerOpen, setEditModulesDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [editBranchNameOpen, setEditBranchNameOpen] = useState(false);

  const handleUserCreated = () => {
    setSnackbarOpen(true);
    fetchUsers();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data.reverse()); // Reverse the order to show new users at the top
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleBranchDrawerOpen = () => {
    setBranchDrawerOpen(true);
  };

  const handleBranchDrawerClose = () => {
    setBranchDrawerOpen(false);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  const handleEditClick = (event, user) => {
    setSelectedUser(user);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditGeneralInfo = () => {
    setEditDrawerOpen(true);
    handleMenuClose();
  };

  const handleEditAssignedModules = () => {
    setEditModulesDrawerOpen(true);
    handleMenuClose();
  };

  const handleEditDrawerClose = () => {
    setEditDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleEditModulesDrawerClose = () => {
    setEditModulesDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleModulesUpdated = () => {
    fetchUsers();
    handleEditModulesDrawerClose();
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      for (let userId of selectedUsers) {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
      }

      setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      setDeleteSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = generateRandomPassword();
    console.log('Reset password for:', userId, 'New Password:', newPassword);

    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/resetPassword`, { newPassword });
      setResetPassword(newPassword);
      setResetSnackbarOpen(true);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const handleEditBranchNameOpen = () => {
    setEditBranchNameOpen(true);
  };

  const handleEditBranchNameClose = () => {
    setEditBranchNameOpen(false);
  };

  const handleBranchUpdated = () => {
    console.log("Branch has been updated");
    fetchUsers(); // Refresh user data or branches as needed
    setEditBranchNameOpen(false);
  };


  return (
    <MainContentWrapper>
      <Box sx={{ maxWidth: '100%', paddingLeft: 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 1,
            fontFamily: 'TanseekModernW20',
          }}
        >
          ACTIVE USERS
        </Typography>

        <Divider sx={{ mb: 0.5, mt: 1 }} />

        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mt: 0,
          }}
        >
          <Button
            variant="text"
            startIcon={<AddIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            onClick={handleDrawerOpen}
          >
            Add a user
          </Button>
          <Button
            variant="text"
            startIcon={<RefreshIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            onClick={fetchUsers}
          >
            Refresh
          </Button>
          <Button
            variant="text"
            startIcon={<DeleteIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            disabled={selectedUsers.length === 0}
            onClick={handleDeleteUsers}
          >
            Delete user
          </Button>
          <Button
            variant="text"
            startIcon={<LockResetIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            disabled={selectedUsers.length !== 1}
            onClick={() => handleResetPassword(selectedUsers[0])}
          >
            Reset password
          </Button>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            onClick={handleBranchDrawerOpen}
          >
            Add a branch
          </Button>

          <Button
            variant="text"
            startIcon={<EditLocationAltIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            onClick={handleEditBranchNameOpen}
          >
            Edit branch 
          </Button>

          <Button
            variant="text"
            startIcon={<FileUploadIcon />}
            sx={{ marginRight: 2, textTransform: 'none', color: '#f15a22' }}
            onClick={handleUploadDialogOpen}
          >
            Upload accounts
          </Button>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search active users list"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300, marginLeft: 'auto' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAllUsers}
                  />
                </TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.branch || 'N/A'}</TableCell>
                  <TableCell>{user.role || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleEditClick(event, user)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              minWidth: 110,
              padding: 0.2,
            },
          }}
        >
          <MenuItem
            onClick={handleEditGeneralInfo}
            sx={{ '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5' } }}
          >
            <ListItemIcon>
              <InfoIcon sx={{ color: '#f15a22' }} />
            </ListItemIcon>
            <ListItemText primary="Edit General Information" />
          </MenuItem>
          <MenuItem
            onClick={handleEditAssignedModules}
            sx={{ '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5' } }}
          >
            <ListItemIcon>
              <AssignmentIcon sx={{ color: '#f15a22' }} />
            </ListItemIcon>
            <ListItemText primary="Edit Assigned Modules" />
          </MenuItem>
        </Menu>

        <AddUserDrawer open={drawerOpen} onClose={handleDrawerClose} onUserCreated={handleUserCreated} />

        <AddBranchDrawer open={branchDrawerOpen} onClose={handleBranchDrawerClose}  />

        <EditUserDrawer
          open={editDrawerOpen}
          onClose={handleEditDrawerClose}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />

        <EditAssignedModulesDrawer
          open={editModulesDrawerOpen}
          onClose={handleEditModulesDrawerClose}
          user={selectedUser}
          onModulesUpdated={handleModulesUpdated}
        />

        <UploadAccounts open={uploadDialogOpen} onClose={handleUploadDialogClose} onUsersAdded={fetchUsers} />

        <EditBranchNameDrawer
          open={editBranchNameOpen} // Pass the state to control the visibility of the drawer
          onBranchUpdated={handleBranchUpdated} 
          onClose={handleEditBranchNameClose} // Pass the function to handle closing the drawer

        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ backgroundColor: '#ffdd00', color: '#7c402e' }}>
            User Has Been Created Successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={deleteSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setDeleteSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setDeleteSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            User(s) deleted successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={resetSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setResetSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setResetSnackbarOpen(false)} severity="info" sx={{ width: '100%', backgroundColor: '#ffdd00', color: '#7c402e' }}>
            Password reset successfully! New password: {resetPassword}
          </Alert>
        </Snackbar>
      </Box>
    </MainContentWrapper>
  );
};

export default ActiveUsers;
