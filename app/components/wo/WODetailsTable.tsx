'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';

const MOCK_DATA = [
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7238', issueDate: '1/5/2026', status: 'Open', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 2390 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7239', issueDate: '1/5/2026', status: 'Open', employeeName: 'HOOVER, DANIEL J', laborAmount: 354 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7239', issueDate: '1/5/2026', status: 'Open', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 386 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7240', issueDate: '1/5/2026', status: 'Work Finished', employeeName: 'HOOVER, DANIEL J', laborAmount: 89 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7240', issueDate: '1/5/2026', status: 'Work Finished', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 772 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7241', issueDate: '1/7/2026', status: 'Work Finished', employeeName: 'HOOVER, DANIEL J', laborAmount: 421 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7241', issueDate: '1/7/2026', status: 'Work Finished', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 386 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7242', issueDate: '1/8/2026', status: 'Work Finished', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 543 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7245', issueDate: '1/8/2026', status: 'Work Finished', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 459 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7246', issueDate: '1/9/2026', status: 'Work Finished', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 386 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7247', issueDate: '1/9/2026', status: 'Work Finished', employeeName: 'HOOVER, DANIEL J', laborAmount: 199 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7248', issueDate: '1/12/2026', status: 'Open', employeeName: 'HOOVER, DANIEL J', laborAmount: 487 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7248', issueDate: '1/12/2026', status: 'Open', employeeName: 'KENYON, CHRISTOPHER', laborAmount: 628 },
  { company: 'J. J. Curran Crane Company', yard: 'Detroit', wo: '7249', issueDate: '1/12/2026', status: 'Open', employeeName: 'HOOVER, DANIEL J', laborAmount: 708 },
];

export default function WODetailsTable() {
  const totalLaborAmount = MOCK_DATA.reduce((acc, curr) => acc + curr.laborAmount, 0);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden', boxShadow: 1 }}>
      <Box sx={{ 
        bgcolor: '#E0F7FA', // Light cyan header
        py: 0.5, 
        px: 2, 
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '2px solid #B2EBF2'
      }}>
        <Typography variant="body2" sx={{ color: '#006064', fontWeight: 'bold' }}>
          WO Details
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto', maxHeight: 350 }}>
        <Table stickyHeader size="small" sx={{
           whiteSpace: 'nowrap',
           '& .MuiTableCell-root': { py: 1, px: 2, fontSize: '0.8rem', borderBottom: '1px solid #EEEEEE' },
           '& .MuiTableHead-root .MuiTableCell-root': { py: 1, fontWeight: 'bold', bgcolor: '#F5F5F5' }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Yard</TableCell>
              <TableCell>WO</TableCell>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 <Box component="span" sx={{ fontSize: '0.6rem' }}>▲</Box>
                 WO Issue Date
              </TableCell>
              <TableCell>WO Status</TableCell>
              <TableCell>EmployeeName</TableCell>
              <TableCell align="right">Labor Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_DATA.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#FAFAFA' } }}>
                <TableCell>{row.company}</TableCell>
                <TableCell>{row.yard}</TableCell>
                <TableCell>{row.wo}</TableCell>
                <TableCell>{row.issueDate}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.employeeName}</TableCell>
                <TableCell align="right">${row.laborAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold', bgcolor: '#F0F0F0', borderBottom: 'none' } }}>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell align="right">${totalLaborAmount.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
