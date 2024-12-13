import React from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const FileItem = ({ file, onDelete }) => {
  const theme = useTheme(); // Access the current theme

  return (
    <Grid container sx={{ padding: '10px 0', borderBottom: '1px solid #ddd', alignItems: 'center' }}>
      <Grid item xs={4}>
        <Typography variant="body2">{file.filename}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2">{file.filetype}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body2">{file.lastModified}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ textAlign: 'right' }}>
        {/* Visibility Icon */}
        <IconButton aria-label="view file" sx={{ color: '#f15a22' }}>
          <VisibilityIcon />
        </IconButton>
        
        {/* Delete Icon */}
        <IconButton aria-label="delete file" onClick={() => onDelete(file.filename)} sx={{ color: '#f15a22' }}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default FileItem;
