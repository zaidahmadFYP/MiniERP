import React from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

const TicketTable = ({ tickets }) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'hidden' }}>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }} aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
              <Typography variant="subtitle1" fontWeight="bold">Ticket ID</Typography>
            </TableCell>
            <TableCell align="center" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
              <Typography variant="subtitle1" fontWeight="bold">Subject</Typography>
            </TableCell>
            <TableCell align="center" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
              <Typography variant="subtitle1" fontWeight="bold">Created At</Typography>
            </TableCell>
            <TableCell align="center" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
              <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.ticketId}
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f9f9f9',
                },
                '&:nth-of-type(even)': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fff',
                },
              }}
            >
              <TableCell align="center">
                <Link href={`#`} underline="hover">{ticket.ticketId}</Link>
              </TableCell>
              <TableCell align="center">{ticket.subject}</TableCell>
              <TableCell align="center">{ticket.createdAt}</TableCell>
              <TableCell align="center">{ticket.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketTable;
