import React from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const FileTable = ({ files, onDelete }) => {
  const theme = useTheme();
  const buttonColor = '#f15a22';

  // Helper function to format the file path by replacing spaces with underscores
  const formatFilePath = (path) => {
    return path.replace(/\s+/g, '_'); // Replace spaces with underscores
  };

  // Helper function to clean file names for display
  const getCleanFileName = (filename) => {
    const nameWithoutUnderscores = filename.replace(/_/g, ' '); // Replace underscores with spaces
    return nameWithoutUnderscores.replace(/\.[^/.]+$/, ''); // Remove the file extension for display
  };

  // Determine file path color based on theme mode
  const filePathColor = theme.palette.mode === 'dark' ? '#80b3ff' : 'blue'; // Lighter blue for dark mode, regular blue for light mode

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'hidden' }}>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }} aria-label="file table">
        <TableHead>
          <TableRow>
            <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">File Path</Typography></TableCell>
            <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">File Name</Typography></TableCell>
            <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">File Type</Typography></TableCell>
            <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">Uploaded Date</Typography></TableCell>
            <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">Manage</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.fileId}>
              {/* FILE PATH */}
              <TableCell align="jusitfy">
                <Typography
                  variant="body2"
                  sx={{ color: filePathColor, textDecoration: 'underline' }}
                >{`HSE/INC/FT/${formatFilePath(getCleanFileName(file.filename))}/${file.fileNumber}`}</Typography>
              </TableCell>

              {/* FILE NAME */}
              <TableCell align="center">
                <Typography variant="body2">{getCleanFileName(file.filename)}</Typography>
              </TableCell>

              {/* FILE TYPE */}
              <TableCell align="center">
                <Typography variant="body2">{file.filetype}</Typography>
              </TableCell>

              {/* UPLOAD DATE */}
              <TableCell align="center">
                <Typography variant="body2">{new Date(file.lastModified).toLocaleString()}</Typography>
              </TableCell>

              {/* DELETE ICON */}
              <TableCell align="center">
                <IconButton onClick={() => onDelete(file.filename)} aria-label="delete" sx={{ color: buttonColor }}>
                  <DeleteIcon />
                </IconButton>

                {/* VIEW ICON */}
                <IconButton
                  aria-label="view"
                  href={`http://localhost:5000/api/files/download/${encodeURIComponent(file.filename)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: buttonColor }}
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FileTable;
