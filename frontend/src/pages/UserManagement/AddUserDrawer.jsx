import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
  Snackbar, // Import Snackbar for notifications
  Alert, // Import Alert for styled messages
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'; // Import axios for API calls

const steps = ['Basics', 'Manage Roles', 'Manage Modules', 'Finish'];

const headquarterRoles = [
  'IT', 'Admin', 'HR', 'Operations', 'Training and Development',
  'Maintainance', 'Warehouse - Humik',
  'Warehouse - Construction', 'Purchase', 'Surveillance', 'Finance'
];
const branchRoles = ['Restaurant Manager'];

const modules = [
  { main: 'Licenses', subModules: ['Trade Licenses', 'Staff Medicals', 'Tourism Licenses', 'Labour Licenses'] },
  { main: 'Approvals', subModules: ['Outer Spaces'] },
  { main: 'Vehicles', subModules: ['Maintenance', 'Token Taxes', 'Route Permits'] },
  { main: 'User Requests', subModules: [] },
  { main: 'Health Safety Environment', subModules: ['Monthly Inspection', 'Quarterly Audit', 'Expiry of Cylinders', 'Incidents', 'Training Status'] },
  { main: 'Taxation', subModules: ['Marketing / Bill Boards Taxes', 'Profession Tax'] },
  { main: 'Certificates', subModules: ['Electric Fitness Test'] },
  { main: 'Security', subModules: ['Guard Training'] },
  { main: 'Admin Policies and SOPs', subModules: [] },
  { main: 'Rental Agreements', subModules: [] },
  { main: 'User Management', subModules: [] },
];

// Predefined modules for Restaurant Manager
const preSelectedModulesForRestaurantManager = {
  'Health Safety Environment_Monthly Inspection': true,
  'Health Safety Environment_Quarterly Audit': true,
  'Health Safety Environment_Expiry of Cylinders': true,
  'Health Safety Environment_Incidents': true,
  'Health Safety Environment_Training Status': true,
  'User Requests_': true,
  'Licenses_Trade Licenses': true,
  'Licenses_Staff Medicals': true,
  'Licenses_Tourism Licenses': true,
  'Licenses_Labour Licenses': true,
  'Approvals_Outer Spaces': true,
  'Vehicles_Maintenance': true,
  'Vehicles_Token Taxes': true,
  'Vehicles_Route Permits': true,
  'Taxation_Marketing / Bill Boards Taxes': true,
  'Taxation_Profession Tax': true,
  'Rental Agreements_': true,
  'Admin Policies and SOPs_': true,
  'Security_Guard Training': true,
  'Certificates_Electric Fitness Test': true
};

const AddUserDrawer = ({ open, onClose, onUserCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [roleType, setRoleType] = useState('Headquarter Roles');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [checkedModules, setCheckedModules] = useState({});
  const [zones, setZones] = useState([]); // State for zones
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedZone, setSelectedZone] = useState(''); // State for selected zone
  const [selectedBranch, setSelectedBranch] = useState(''); // State for selected branch
  const [notificationOpen, setNotificationOpen] = useState(false); // State for Snackbar

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Form state
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    username: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Password generation state
  const [generatePassword, setGeneratePassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Fetch zones from the server
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/zones`);
        setZones(response.data); // Update state with fetched zones
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, []);

  // Fetch branches based on selected zone
  useEffect(() => {
    if (selectedZone) {
      const fetchBranches = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/zones/${selectedZone}/branches`);
          setBranches(response.data); // Update branches state
        } catch (error) {
          console.error('Error fetching branches:', error);
          setBranches([]); // Clear branches on error
        }
      };

      fetchBranches();
    } else {
      setBranches([]); // Clear branches if no zone is selected
    }
  }, [selectedZone]);

  // Reset function to clear drawer state when closed
  const resetDrawer = () => {
    setActiveStep(0);
    setRoleType('Headquarter Roles');
    setRole('');
    setCustomRole('');
    setCheckedModules({});
    setSelectedZone('');
    setSelectedBranch('');
    setFormValues({
      firstName: '',
      lastName: '',
      displayName: '',
      username: '',
    });
    setFormErrors({});
    setGeneratePassword(false);
    setGeneratedPassword('');
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = {
      ...formValues,
      [name]: value,
    };

    // Update the displayName automatically based on firstName and lastName
    if (name === 'firstName' || name === 'lastName') {
      updatedValues.displayName = `${updatedValues.firstName} ${updatedValues.lastName}`.trim();
    }

    setFormValues(updatedValues);

    if (value.trim()) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Handle role type change
  const handleRoleTypeChange = (e) => {
    setRoleType(e.target.value);
    setRole(''); // Clear selected role or input
    setCheckedModules({}); // Clear pre-selected modules
    if (e.target.value !== 'Custom Role') {
      setCustomRole(''); // Reset custom role if not selected
    }
  };

  // Handle role selection or custom role input
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    // If the selected role is Restaurant Manager, pre-select the modules
    if (selectedRole === 'Restaurant Manager') {
      setCheckedModules(preSelectedModulesForRestaurantManager);
    } else {
      setCheckedModules({}); // Clear modules for other roles
    }
  };

  // Handle custom role input
  const handleCustomRoleChange = (e) => {
    setCustomRole(e.target.value);
    setRole(e.target.value); // Set the custom role as the role value
  };

  // Password generation function
  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 5; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Handle password generation checkbox change
  const handlePasswordGenerationChange = (e) => {
    setGeneratePassword(e.target.checked);
    if (e.target.checked) {
      const newPassword = generateRandomPassword();
      setGeneratedPassword(newPassword);
    } else {
      setGeneratedPassword(''); // Clear password if unchecked
    }
  };

  // Validation before going to the next step
  const validateForm = () => {
    let errors = {};

    if (!formValues.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    if (!formValues.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
    if (!formValues.displayName.trim()) {
      errors.displayName = 'Display Name is required';
    }
    if (!formValues.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!generatePassword) {
      errors.generatePassword = 'You must generate a password';
      //alert('Please select "Generate New Password" before proceeding.');
    }

    setFormErrors(errors);

    // If there are no errors, return true
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle module selection for Manage Modules step
  const handleModuleChange = (main, sub) => (event) => {
    const key = `${main}_${sub}`;
    setCheckedModules({
      ...checkedModules,
      [key]: event.target.checked,
    });
  };

  // Helper function to format the selected modules with sub-modules
  const formatModules = () => {
    let formattedModules = [];

    for (const moduleKey in checkedModules) {
      if (checkedModules[moduleKey]) {
        const [mainModule, subModule] = moduleKey.split('_');
        if (subModule) {
          const mainModuleIndex = formattedModules.findIndex(
            (module) => module.main === mainModule
          );
          if (mainModuleIndex !== -1) {
            formattedModules[mainModuleIndex].subModules.push(subModule);
          } else {
            formattedModules.push({ main: mainModule, subModules: [subModule] });
          }
        } else {
          formattedModules.push({ main: mainModule, subModules: [] });
        }
      }
    }
    return formattedModules;
  };

  // Render formatted modules in the Review Details step
  const renderModules = () => {
    const formattedModules = formatModules();

    return formattedModules.map((module) => (
      <Box key={module.main} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 'bold' }}>{module.main}</Typography>
        {module.subModules.length > 0 && (
          <ul>
            {module.subModules.map((subModule) => (
              <li key={subModule}>{subModule}</li>
            ))}
          </ul>
        )}
      </Box>
    ));
  };

  // Handle selecting/deselecting all submodules
  const handleSelectAllSubmodules = (main, checked) => {
    const updatedCheckedModules = { ...checkedModules };

    modules.forEach((module) => {
      if (module.main === main) {
        module.subModules.forEach((sub) => {
          updatedCheckedModules[`${main}_${sub}`] = checked;
        });
      }
    });

    setCheckedModules(updatedCheckedModules);
  };

  // Render module selection for Manage Modules step
  const renderModuleSelection = () => {
    const modulesWithSubModules = modules.filter((module) => module.subModules.length > 0);
    const modulesWithoutSubModules = modules.filter((module) => module.subModules.length === 0);
  
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
            borderRadius: '15px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
          },
        }}
      >
        {/* Modules with Submodules */}
        {modulesWithSubModules.map((module) => (
          <Accordion key={module.main} sx={{ marginBottom: 0 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />}
              sx={{
                minHeight: '32px', // Decrease the height further
                '&.Mui-expanded': {
                  minHeight: '32px', // Maintain the compact height when expanded
                },
                '.MuiAccordionSummary-content': {
                  margin: '4px 0', // Reduce inner content spacing
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={module.subModules.every((sub) => !!checkedModules[`${module.main}_${sub}`])}
                    indeterminate={
                      module.subModules.some((sub) => !!checkedModules[`${module.main}_${sub}`]) &&
                      !module.subModules.every((sub) => !!checkedModules[`${module.main}_${sub}`])
                    }
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent accordion from toggling
                      handleSelectAllSubmodules(module.main, e.target.checked);
                    }}
                    sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                  />
                }
                label={
                  <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
                    {module.main}
                  </Typography>
                }
                sx={{ marginRight: 1 }}
                onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling when clicking on the label
              />
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
                        sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                      />
                    }
                    label={subModule}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
  
        {/* Modules without Submodules */}
        {modulesWithoutSubModules.map((module) => (
          <Accordion key={module.main} sx={{ marginBottom: 0 }}>
            <AccordionSummary
              sx={{
                minHeight: '32px', // Decrease the height further
                '&.Mui-expanded': {
                  minHeight: '32px', // Maintain the compact height when expanded
                },
                '.MuiAccordionSummary-content': {
                  margin: '4px 0', // Reduce inner content spacing
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkedModules[`${module.main}_`]}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent accordion from toggling
                      handleModuleChange(module.main, '')(e);
                    }}
                    sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                  />
                }
                label={
                  <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
                    {module.main}
                  </Typography>
                }
                sx={{ marginRight: 1 }}
                onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling when clicking on the label
              />
            </AccordionSummary>
          </Accordion>
        ))}
      </Box>
    );
  };
  
  

  // Handle finish and submit user
  const handleFinish = async () => {
    const user = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      displayName: formValues.displayName,
      username: formValues.username.trim(),
      password: generatedPassword || formValues.password,
      role: role,
      zone: selectedZone,
      branch: selectedBranch,
      modules: Object.keys(checkedModules).filter((moduleKey) => checkedModules[moduleKey]),
    };

    console.log("Password being sent to backend:", generatedPassword);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User created:', data);
        onClose();
        setNotificationOpen(true); // Open the notification
      } else {
        console.error('Error creating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the notification
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        resetDrawer();
        onClose();
      }}
      PaperProps={{ sx: { width: '70%' } }}
    >
      <Box sx={{
        display: 'flex',
        height: '100%',
        paddingTop: '64px',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#f15a22',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
        }
      }}>
        <Box
          sx={{
            width: '20%',
            backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
            paddingTop: 3,
            paddingLeft: 2,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    style: { color: activeStep >= index ? '#f15a22' : isDarkMode ? '#555' : '#d1d1d1' },
                  }}
                >
                  <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          sx={{
            width: '80%',
            padding: 4,
            height: '100%',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#f15a22',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
            }
          }}
        >
          {activeStep === 0 ? (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
                Set up the basics
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
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#d1d1d1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f15a22',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f15a22',
                        },
                      },
                      '& label.Mui-focused': {
                        color: '#f15a22',
                      },
                    }}
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
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#d1d1d1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f15a22',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f15a22',
                        },
                      },
                      '& label.Mui-focused': {
                        color: '#f15a22',
                      },
                    }}
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
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.displayName}
                    helperText={formErrors.displayName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#d1d1d1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f15a22',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f15a22',
                        },
                      },
                      '& label.Mui-focused': {
                        color: '#f15a22',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label="Username"
                      fullWidth
                      name="username"
                      variant="outlined"
                      value={formValues.username}  // Do not append @cheezious.com here
                      onChange={handleInputChange}  // Keep it as raw input
                      InputLabelProps={{ shrink: true }}
                      error={!!formErrors.username}
                      helperText={formErrors.username}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#d1d1d1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#f15a22',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f15a22',
                          },
                        },
                        '& label.Mui-focused': {
                          color: '#f15a22',
                        },
                      }}
                    />
                    <Typography sx={{ marginLeft: 1, color: isDarkMode ? '#fff' : '#000' }}>
                      @cheezious.com
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={generatePassword}
                        onChange={handlePasswordGenerationChange}
                        sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                      />
                    }
                    label="Generate New Password"
                  />
                  {formErrors.generatePassword && (
                    <Typography sx={{ color: '#f44336', mt: 1 }}>
                      {formErrors.generatePassword}
                    </Typography>
                  )}
                </Grid>

              </Grid>
            </>
          ) : activeStep === 1 ? (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
                Manage Roles
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{
                    color: '#f15a22',
                    '&.Mui-focused': {
                      color: '#f15a22',
                    },
                  }}
                >
                  Select Type
                </FormLabel>
                <RadioGroup row value={roleType} onChange={handleRoleTypeChange}>
                  <FormControlLabel
                    value="Headquarter Roles"
                    control={<Radio sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }} />}
                    label="Department"
                  />
                  <FormControlLabel
                    value="Branch Roles"
                    control={<Radio sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }} />}
                    label="Branch"
                  />
                  <FormControlLabel
                    value="Custom Role"
                    control={<Radio sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }} />}
                    label="Custom"
                  />
                </RadioGroup>
              </FormControl>

              {roleType === 'Custom Role' && (
                <TextField
                  label="Enter Custom Role"
                  fullWidth
                  variant="outlined"
                  value={customRole}
                  onChange={handleCustomRoleChange}
                  sx={{
                    mt: 3,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d1d1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#f15a22',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f15a22',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#f15a22',
                    },
                  }}
                />
              )}

              {roleType !== 'Custom Role' && roleType === 'Headquarter Roles' ? (
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <Select
                    value={role}
                    onChange={handleRoleChange}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f15a22',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f15a22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f15a22',
                      },
                      '& .MuiSelect-icon': {
                        color: '#f15a22',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Department
                    </MenuItem>
                    {headquarterRoles.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : roleType !== 'Custom Role' && (
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <Select
                    value={role}
                    onChange={handleRoleChange}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f15a22',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f15a22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f15a22',
                      },
                      '& .MuiSelect-icon': {
                        color: '#f15a22',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Branch Role
                    </MenuItem>
                    {branchRoles.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* New Dropdowns for Zone and Branch */}
              <FormControl fullWidth sx={{ mt: 3 }}>
                <Select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '& .MuiSelect-icon': {
                      color: '#f15a22',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Zone
                  </MenuItem>
                  {zones.map((zone) => (
                    <MenuItem key={zone._id} value={zone.zoneName}>
                      {zone.zoneName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 3 }}>
                {console.log('Selected Branch:', selectedBranch)} {/* Debugging for selectedBranch */}
                {console.log('Branches:', branches)} {/* Debugging for branches */}

                <Select
                  value={selectedBranch || ""} // Ensure it has a fallback value
                  onChange={(e) => {
                    console.log('Branch Selected:', e.target.value); // Log the selected branch
                    setSelectedBranch(e.target.value); // Update the selectedBranch state
                  }}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '& .MuiSelect-icon': {
                      color: '#f15a22',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {branches.length === 0 ? "No Zone Selected" : "Select Branch"}
                  </MenuItem>

                  {branches.length > 0 &&
                    branches.map((branch, index) => {
                      return (
                        <MenuItem key={index} value={branch}>
                          {branch} {/* Directly using the string as the label and value */}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </>
          ) : activeStep === 2 ? (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
                Manage Modules
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {renderModuleSelection()}
            </>
          ) : activeStep === 3 ? (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
                Review Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell variant="head"><strong>Name:</strong></TableCell>
                    <TableCell>{formValues.firstName} {formValues.lastName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head"><strong>Display Name:</strong></TableCell>
                    <TableCell>{formValues.displayName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head"><strong>Username:</strong></TableCell>
                    <TableCell>{formValues.username}@cheezious.com</TableCell>
                  </TableRow>
                  {generatePassword && (
                    <TableRow>
                      <TableCell variant="head"><strong>Generated Password:</strong></TableCell>
                      <TableCell>{generatedPassword}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell variant="head"><strong>Role:</strong></TableCell>
                    <TableCell>{role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head"><strong>Zone:</strong></TableCell>
                    <TableCell>{selectedZone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head"><strong>Branch:</strong></TableCell>
                    <TableCell>{selectedBranch}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head"><strong>Selected Modules:</strong></TableCell>
                    <TableCell>{renderModules()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : null}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, color: '#f15a22' }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleFinish}
                sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
              >
                Finish
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
              >
                Next
              </Button>
            )}
          </Box>

          {/* Add the Snackbar component */}
          <Snackbar
            open={notificationOpen}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%' }}>
              User Has Been Created Successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddUserDrawer;