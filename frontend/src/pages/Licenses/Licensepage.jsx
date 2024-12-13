import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ModulesGrid from './Modulesgrid/Modulesgrid';
import { useTheme } from '@mui/material/styles';
import Banner from '../../Component/BannerComponent/BannerComponent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const MainContent = styled(Box)(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f5f5f5',
    color: theme.palette.mode === 'dark' ? '#FFF' : '#000',
    minHeight: '100vh',
    transition: theme.transitions.create(['padding'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: 'hidden',
  })
);

const LicensePage = ({user}) => {
  const theme = useTheme();
  const headingColor = theme.palette.mode === 'dark' ? '#f15a22' : '#000000';

  return (
    <MainContent>

      <Box sx={{ mb: -5, ml: 1 }}>
        <Banner />
      </Box>


      <Typography
        variant="h4"
        sx={{
          color: headingColor,
          mb: 4,
          textAlign: 'left',
          ml: 6,
          fontSize: '30px',
          fontFamily: 'TanseekModernW20',
        }}
      >
        LICENSES
      </Typography>

      {/* Grid layout for the ModulesGrid */}
      <Grid container spacing={2} alignItems="flex-start">
        {/* Modules Grid Section */}
        <Grid item xs={12}>
          <Box sx={{ ml: 6, mt: -6 }}>
            <ModulesGrid user={user} />
          </Box>
        </Grid>
      </Grid>
    </MainContent >
  );
};

export default LicensePage;


