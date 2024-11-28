import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'; 

// Component Imports 
import SignInPage from './Component/Signin/Signin';
import AppBarComponent from './Component/AppBarComponent/AppBarComponent';
import DrawerComponent from './Component/DrawerComponent/DrawerComponent';
import MainContent from './Component/MainContent/MainContent';
import ModulesGrid from './pages/Approval/Modulesgrid/Modulesgrid';
import SessionTimeout from './SessionTimeout';

// Licenses Import
import Licensepage from './pages/Licenses/Licensepage';
import Cantonment from './pages/Licenses/Cantonment/Cantonment';
import CapitalFoodAuthority from './pages/Licenses/CapitalFoodAuthority/CapitalFoodAuthority';
import HiringTests from './pages/Licenses/HiringTests/HiringTests';
import IslamabadFoodAuthority from './pages/Licenses/IslamabadFoodAuthority/IslamabadFoodAuthority';
import LabourLicenses from './pages/Licenses/LabourLicenses/LabourLicenses';
import Medical from './pages/Licenses/Medical/Medical';
import PunjabFoodAuthority from './pages/Licenses/PunjabFoodAuthority/PunjabFoodAuthority';
import RecurringMedicalTests from './pages/Licenses/RecurringMedicalTests/RecurringMedicalTests';
import TourismLicenses from './pages/Licenses/TourismLicenses/TourismLicenses';
import VaccineRecord from './pages/Licenses/VaccineRecord/VaccineRecord';

// HSE Imports
import Hse from './pages/Hse/Hse';
import ExpiryofCylinders from './pages/Hse/ExpiryofCylinders/ExpiryofCylinders';
import Fatal from './pages/Hse/Fatal/Fatal';
import LostTimeInjury from './pages/Hse/LostTimeInjury/LostTimeInjury';
import MonthlyInspection from './pages/Hse/MonthlyInspection/MonthlyInspection';
import QuarterlyAudit from './pages/Hse/QuarterlyAudit/QuarterlyAudit';
import RestrictedWorkInjury from './pages/Hse/RestrictedWorkInjury/RestrictedWorkInjury';
import FireSafety from './pages/Hse/FireSafety/FireSafety';

// Taxation Imports 
import Taxationpage from './pages/Taxation/Taxationpage';
import MarketingBillBoardsTaxes from './pages/Taxation/MarketingBillBoardsTaxes/MarketingBillBoardsTaxes';
import ProfessionTax from './pages/Taxation/ProfessionTax/ProfessionTax';

// Certificate imports
import ElectricFitnessTest from './pages/Certificate/ElectricFitnessTest/ElectricFitnessTest';
import Certificatepage from './pages/Certificate/Certificatepage';

// Security Imports 
import GuardTraining from './pages/Security/GuardTraining/GuardTraining';

// Rental Agreements Imports
import RentalAgreements from './pages/RentalAgreements/RentalAgreements';

// User Requests Imports
import UserRequests from './pages/UserRequests/UserRequests';

// Admin Policies and SOP's Imports 
import AdminPolicies from './pages/AdminPolicies/AdminPolicies';

// Approval Page Imports
import Approvalpage from './pages/Approval/Approvalpage';
import DineIn from './pages/Approval/DineIn/DineIn';
import Generators from './pages/Approval/Generators/Generators';
import Facilities from './pages/Approval/Facilities/Facilities';

// Vehicle Page Imports
import Vehiclepage from './pages/Vehicles/Vehiclepage';
import RoutineMaintainence from './pages/Vehicles/RoutineMaintainence/RoutineMaintainence';
import MajorParts from './pages/Vehicles/MajorParts/MajorParts';
import MajorRepairs from './pages/Vehicles/MajorRepairs/MajorRepairs';
import AnnualTokenTax from './pages/Vehicles/AnnualTokenTax/AnnualTokenTax';
import MTag from './pages/Vehicles/MTag/MTag';
import CanttPasses from './pages/Vehicles/CanttPasses/CanttPasses';
import Islamabad from './pages/Vehicles/Islamabad/Islamabad';
import Peshawar from './pages/Vehicles/Peshawar/Peshawar';
import Rawalpindi from './pages/Vehicles/Rawalpindi/Rawalpindi';
import Wah from './pages/Vehicles/Wah/Wah';

// User Management Imports
import ActiveUsers from './pages/UserManagement/ActiveUsers';

function App() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [user, setUser] = useState(null); // State to hold the user data

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // Store the user data upon successful login
    localStorage.setItem('token', 'your-auth-token');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const items = [

    { name: 'Licenses', path: '/Licenses/Licensepage', category: 'Modules > Licenses' },
    //sub-modules
    { name: 'Trade Licenses', path: '/Licenses/Licensepage', category: 'Modules > Licenses > Trade Licenses' },
    { name: 'Staff Medicals', path: '/UserManagement', category: 'Modules > Licenses > Staff Medicals' },
    { name: 'Toursim Licenses', path: '/UserManagement', category: 'Modules > Licenses > Tourism Licenses' },
    { name: 'Labour Licenses', path: '/UserManagement', category: 'Modules > Licenses > Labour Licenses' },

    { name: 'Approvals', path: '/Approval/Approvalpage', category: 'Modules > Approvals' },
    //sub-modules
    { name: 'Outer Spaces', path: '/Approval/Approvalpage', category: 'Modules > Approvals > Outer Spaces' },


    { name: 'Vehicles', path: '/Vehicles/Vehiclepage', category: 'Modules > Vehicles' },
    //sub-modules
    { name: 'Maintenance', path: '/Vehicles/Vehiclepage', category: 'Modules > Vehicles > Maintenance' },
    { name: 'Route Permits', path: '/Vehicles/Vehiclepage', category: 'Modules > Vehicles > Route Permits' },
    { name: 'Token Taxes', path: '/Vehicles/Vehiclepage', category: 'Modules > Vehicles > Token Taxes' },

    { name: 'User Requests', path: '/UserRequests', category: 'Modules > User Requests' },

    { name: 'Health Safety Environment', path: '/Hse/Hse', category: 'Modules > Health Safety Environment' },
    //sub-modules
    { name: 'Monthly Inspection', path: '/Hse/Hse', category: 'Modules > Health Safety Environment > Monthly Inspection' },
    { name: 'Quarterly Audit', path: '/Hse/Hse', category: 'Modules > Health Safety Environment > Monthly Inspection > Quarterly Audit' },
    { name: 'Training Status', path: '/Hse/Hse', category: 'Modules > Health Safety Environment > Training Status' },
    { name: 'Incidents', path: '/Hse/Hse', category: 'Modules > Health Safety Environment > Incidents' },


    { name: 'Taxation', path: '/Taxation/Taxationpage', category: 'Modules > Taxation' },
    //sub-modules
    { name: 'Marketing / BillBoards Taxes', path: '/Taxation/Taxationpage', category: 'Modules > Taxation > Marketing / BillBoards Taxes' },
    { name: 'Profession Taxes', path: '/Taxation/Taxationpage', category: 'Modules > Taxation > Profession Taxes' },

    { name: 'Certificates', path: '/Certificate/Certificatepage', category: 'Modules > Certificates' },
    //sub-modules
    { name: 'Electric Fitness Test', path: '/Certificate/Certificatepage', category: 'Modules > Certificates > Electric Fitness Test' },

    { name: 'Security', path: '/Security/Securitypage', category: 'Modules > Security' },

    { name: 'Admin Policies and SOPs', path: '/AdminPolicies', category: 'Modules > Admin Policies' },

    { name: 'Rental Agreements', path: '/RentalAgreements', category: 'Modules > Rental Agreements' },

    { name: 'User Management', path: '/UserManagement/ActiveUsers', category: 'Modules > User Management' },

  ];

  const handleSearch = (query) => {
    if (typeof query === 'string') {
      setSearchQuery(query);
      if (query) {
        const results = [];
        items.forEach((item) => {
          // Check if the user has access to this item (simplified check)
          const hasAccess = user?.registeredModules.some((module) => module.includes(item.name));
          // If user has access and the query matches the item name, add it to results
          if (hasAccess && item.name.toLowerCase().includes(query.toLowerCase())) {
            results.push(item);
          }
        });
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#FFFFFF',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.15s ease, color 0.15s ease',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>

        {/* Integrate SessionTimeout Component */}
        {isAuthenticated && (
          <SessionTimeout timeout={15 * 60 * 1000} onLogout={handleLogout} />
        )}

        {isAuthenticated && (
          <AppBarComponent
            open={open}
            handleDrawerToggle={handleDrawerToggle}
            darkMode={darkMode}
            handleDarkModeToggle={handleDarkModeToggle}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            searchResults={searchResults}
            onLogout={handleLogout}
            user={user}
          />
        )}
        {isAuthenticated && (
          <DrawerComponent
            open={open}
            user={user}
            handleDrawerToggle={handleDrawerToggle}
            theme={theme}
          />
        )}
        <Routes>
          <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />

          <Route
            path="/"
            element={isAuthenticated ? <MainContent user={user} /> : <Navigate to="/login" />}
          />

          <Route path="/UserManagement/" element={isAuthenticated ? <ActiveUsers open={open} /> : <Navigate to="/login" />} />

          <Route path="/RentalAgreements/" element={isAuthenticated ? <RentalAgreements user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/AdminPolicies/" element={isAuthenticated ? <AdminPolicies user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/UserRequests/" element={isAuthenticated ? <UserRequests user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/Licenses/Licensepage" element={isAuthenticated ? <Licensepage user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/Cantonment" element={isAuthenticated ? <Cantonment user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/CapitalFoodAuthority" element={isAuthenticated ? <CapitalFoodAuthority user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/IslamabadFoodAuthority" element={isAuthenticated ? <IslamabadFoodAuthority user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/LabourLicenses" element={isAuthenticated ? <LabourLicenses user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/Medical" element={isAuthenticated ? <Medical user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/PunjabFoodAuthority" element={isAuthenticated ? <PunjabFoodAuthority user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/RecurringMedicalTests" element={isAuthenticated ? <RecurringMedicalTests user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/TourismLicenses" element={isAuthenticated ? <TourismLicenses user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/VaccineRecord" element={isAuthenticated ? <VaccineRecord user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Licenses/HiringTests" element={isAuthenticated ? <HiringTests user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/Approval/Approvalpage" element={isAuthenticated ? <Approvalpage user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Approval/DineIn" element={isAuthenticated ? <DineIn user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Approval/Generators" element={isAuthenticated ? <Generators user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Approval/Facilities" element={isAuthenticated ? <Facilities user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/Vehicles/Vehiclepage" element={isAuthenticated ? <Vehiclepage user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/RoutineMaintainence" element={isAuthenticated ? <RoutineMaintainence user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/MajorParts" element={isAuthenticated ? <MajorParts user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/MajorRepairs" element={isAuthenticated ? <MajorRepairs user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/AnnualTokenTax" element={isAuthenticated ? <AnnualTokenTax user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/MTag" element={isAuthenticated ? <MTag user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/CanttPasses" element={isAuthenticated ? <CanttPasses user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/Islamabad" element={isAuthenticated ? <Islamabad user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/Peshawar" element={isAuthenticated ? <Peshawar user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/Rawalpindi" element={isAuthenticated ? <Rawalpindi user={user} /> : <Navigate to="/login" />} />
          <Route path="/Vehicles/Wah" element={isAuthenticated ? <Wah user={user} /> : <Navigate to="/login" />} />

          <Route path="/Hse/Hse" element={isAuthenticated ? <Hse user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/MonthlyInspection" element={isAuthenticated ? <MonthlyInspection user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/QuarterlyAudit" element={isAuthenticated ? <QuarterlyAudit user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/ExpiryofCylinders" element={isAuthenticated ? <ExpiryofCylinders user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/Fatal" element={isAuthenticated ? <Fatal user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/LostTimeInjury" element={isAuthenticated ? <LostTimeInjury user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/RestrictedWorkInjury" element={isAuthenticated ? <RestrictedWorkInjury user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Hse/FireSafety" element={isAuthenticated ? <FireSafety user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/Taxation/Taxationpage" element={isAuthenticated ? <Taxationpage user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Taxation/MarketingBillBoardsTaxes" element={isAuthenticated ? <MarketingBillBoardsTaxes user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Taxation/ProfessionTax" element={isAuthenticated ? <ProfessionTax user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/Certificate/Certificatepage" element={isAuthenticated ? <Certificatepage user={user} open={open} /> : <Navigate to="/login" />} />
          <Route path="/Certificate/ElectricFitnessTest" element={isAuthenticated ? <ElectricFitnessTest user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/Security/GuardTraining" element={isAuthenticated ? <GuardTraining user={user} open={open} /> : <Navigate to="/login" />} />

          <Route path="/ModulesGrid" element={isAuthenticated ? <ModulesGrid /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;