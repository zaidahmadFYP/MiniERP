import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TableHead,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function groupCylindersByLocation(cylinders) {
  const grouped = {};

  for (const cyl of cylinders) {
    const { _id, location, categories } = cyl;
    // If we haven't encountered this location yet, store this cylinder's _id
    if (!grouped[location]) {
      grouped[location] = { _id, location, categories: [] };
    }
    // Add this cylinder's categories to the grouped categories
    grouped[location].categories.push(...categories);
  }

  return Object.values(grouped);
}

const CylinderTable = ({ cylinders, onDelete, user }) => {
  const theme = useTheme();
  const buttonColor = '#f15a22';
  const groupedCylinders = groupCylindersByLocation(cylinders);

  return (
    <TableContainer
      component={Paper}
      sx={{ width: '100%', overflowX: 'auto', borderRadius: '8px' }}
    >
      <Table aria-label="cylinder table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#1c1c1c' : '#e6e6e6',
            }}
          >
            <TableCell
              align="left"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                fontWeight: 'bold',
                padding: '12px',
              }}
            >
              Location
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                fontWeight: 'bold',
                padding: '12px',
              }}
            >
              Category
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                fontWeight: 'bold',
                padding: '12px',
              }}
            >
              Weight
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                fontWeight: 'bold',
                padding: '12px',
              }}
            >
              Expiry Date
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                fontWeight: 'bold',
                padding: '12px',
              }}
            >
              Manage
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedCylinders.map((locationGroup, groupIndex) => {
            const { location, categories, _id } = locationGroup;

            return (
              <React.Fragment key={groupIndex}>
                {categories.map((cat, catIndex) => (
                  <TableRow
                    key={catIndex}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f9f9f9',
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fff',
                      },
                    }}
                  >
                    {catIndex === 0 && (
                      <TableCell
                        rowSpan={categories.length}
                        align="left"
                        sx={{ verticalAlign: 'top', padding: '12px', fontWeight: 'bold' }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {location}
                        </Typography>
                      </TableCell>
                    )}

                    <TableCell sx={{ padding: '12px' }}>
                      <Typography variant="body2">{cat.category}</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '12px' }}>
                      <Typography variant="body2">{cat.weight}</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '12px' }}>
                      <Typography variant="body2">
                        {new Date(cat.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>

                    {catIndex === 0 && (
                      <TableCell
                        rowSpan={categories.length}
                        align="left"
                        sx={{ verticalAlign: 'top', padding: '12px' }}
                      >
                        {(user?.role === 'Admin' || user?.role === 'Restaurant Manager') && onDelete && (
                          <IconButton
                            onClick={() => onDelete(_id)}
                            aria-label="delete"
                            sx={{ color: buttonColor }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {groupIndex < groupedCylinders.length - 1 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{
                        border: 'none',
                        textAlign: 'center',
                        padding: '10px 0',
                      }}
                    >
                      <Box
                        sx={{
                          width: '80%',
                          height: '3px',
                          margin: '0 auto',
                          backgroundColor: '#f15a22',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CylinderTable;
