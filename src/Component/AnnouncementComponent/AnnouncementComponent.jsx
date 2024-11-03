import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const MajorAnnouncements = () => {
  return (
    <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Major Announcements
      </Typography>
      <Typography variant="body1">
        No new major announcements.
      </Typography>
    </Paper>
  );
};

export default MajorAnnouncements;
