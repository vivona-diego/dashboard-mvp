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
  { unitCode: 'TRL38', cnt: 1, activity: 'Trailer Service', daysPastDue: 378, dueDate: '3/17/2025' },
  { unitCode: 'TRL42', cnt: 1, activity: 'Annual Vehicle Inspection Report', daysPastDue: 289, dueDate: '6/14/2025' },
  { unitCode: 'TRL38', cnt: 1, activity: 'Annual Vehicle Inspection Report', daysPastDue: 194, dueDate: '9/17/2025' },
  { unitCode: 'TRL32', cnt: 1, activity: 'Annual Vehicle Inspection Report', daysPastDue: 170, dueDate: '10/11/2025' },
  { unitCode: 'TRL35', cnt: 1, activity: 'Annual Vehicle Inspection Report', daysPastDue: 170, dueDate: '10/11/2025' },
  { unitCode: 'TRL32', cnt: 1, activity: 'Trailer Service', daysPastDue: 108, dueDate: '12/12/2025' },
  { unitCode: 'CR7', cnt: 1, activity: 'Annual Crane Inspection', daysPastDue: 73, dueDate: '1/16/2026' }
];

export default function PastDueDaysTable() {
  const totals = MOCK_DATA.reduce(
    (acc, curr) => ({
      cnt: acc.cnt + curr.cnt,
      daysPastDue: acc.daysPastDue + curr.daysPastDue,
    }),
    { cnt: 0, daysPastDue: 0 }
  );

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ 
        bgcolor: '#CFD8DC', 
        py: 0.5, 
        px: 2, 
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Typography variant="subtitle2" sx={{ color: '#455A64', fontSize: '0.8rem' }}>
          Past Due Unit Activities - By Days
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflow: 'auto', maxHeight: 250 }}>
        <Table stickyHeader size="small" sx={{
          '& .MuiTableCell-root': { py: 0.6, px: 1, fontSize: '0.75rem', borderBottom: '1px solid #EEEEEE' },
          '& .MuiTableHead-root .MuiTableCell-root': { py: 0.6 }
        }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Unit Code</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Cnt</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Activity</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                 Days Past Due
                 <Box component="span" sx={{ fontSize: '0.6rem' }}>▼</Box>
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_DATA.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#F5F5F5' } }}>
                <TableCell>{row.unitCode}</TableCell>
                <TableCell>{row.cnt}</TableCell>
                <TableCell>{row.activity}</TableCell>
                <TableCell align="right">{row.daysPastDue}</TableCell>
                <TableCell align="right">{row.dueDate}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
              <TableCell>Total</TableCell>
              <TableCell>{totals.cnt}</TableCell>
              <TableCell colSpan={2} align="center">{totals.daysPastDue / totals.cnt /* mock avg conceptually */}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
