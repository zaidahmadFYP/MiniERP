import React from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AnnouncementForm = ({ onClose, user }) => {
  const handleAddAnnouncement = () => {
    const announcement = document.querySelector('textarea').value;
    fetch(`${process.env.REACT_APP_API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcement, createdBy: user.name }),
    }) 
      .then((response) => response.json())
      .then((data) => onClose())
      .catch((error) => console.error('Error saving announcement:', error));
  };

  return (
    <Box
      id="announcement-backdrop"
      onClick={(event) => event.target.id === 'announcement-backdrop' && onClose()}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh', // Full screen height
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center', // Vertically center
        justifyContent: 'center', // Horizontally center
        zIndex: 1200,
        overflow: 'hidden', // Prevents any overflow from showing
      }}
    >
      <Fade in timeout={300}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '500px',
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add Announcement</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            label="Announcement"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{
              mt: 1.5,
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f15a22',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#f15a22',
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#f15a22',
              '&:hover': { backgroundColor: '#d14e1f' },
            }}
            onClick={handleAddAnnouncement}
          >
            Add Announcement
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AnnouncementForm;
