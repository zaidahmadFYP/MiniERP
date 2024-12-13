import React from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';

const FileItem = ({ file, onDelete }) => {
  const handleDelete = () => {
    onDelete(file.filename);
  };

  return (
    <Grid container alignItems="center" sx={{ padding: '10px 0', borderBottom: '1px solid #ccc' }}>
      <Grid item xs={4}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{file.filename}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2" color="textSecondary">
          {file.filetype}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body2" color="textSecondary">
          {file.lastModified}
        </Typography>
      </Grid>
      <Grid item xs={3} sx={{ textAlign: 'right' }}>
        {/* Set color to f15a22 for both icons */}
        <IconButton aria-label="view file" sx={{ color: '#f15a22', marginRight: '5px' }}>
          <VisibilityIcon />
        </IconButton>
        <IconButton aria-label="delete file" sx={{ color: '#f15a22' }} onClick={handleDelete}>
          <DeleteIcon />
          
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default FileItem;
