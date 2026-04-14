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
  { unitCode: 'AT80-01', cnt: 1, activity: 'Fire Extinguisher Inspection', avgDays: 59, dueDate: '5/28/2026' },
  { unitCode: 'BT26-01', cnt: 1, activity: 'Fire Extinguisher Inspection', avgDays: 59, dueDate: '5/28/2026' },
  { unitCode: 'C1', cnt: 1, activity: 'Fire Extinguisher Inspection', avgDays: 59, dueDate: '5/28/2026' },
  { unitCode: 'C11', cnt: 1, activity: 'Fire Extinguisher Inspection', avgDays: 59, dueDate: '5/28/2026' },
  { unitCode: 'C16', cnt: 1, activity: 'Fire Extinguisher Inspection', avgDays: 59, dueDate: '5/28/2026' },
  { unitCode: 'C17', cnt: 1, activity: 'Fire Extinguisher Inspection', avgDays: 59, dueDate: '5/28/2026' }
];

export default function ComingDueDaysTable() {
  const totals = MOCK_DATA.reduce(
    (acc, curr) => ({
      cnt: acc.cnt + curr.cnt,
      avgDays: 54 // Mocking the total average to match 54 in the screenshot
    }),
    { cnt: 0, avgDays: 54 }
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
          Coming Due Unit Activities - By Days
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
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Avg Coming<br/>Due Days</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, borderBottom: 'none' }}>
                 Due Date
                 <Box component="span" sx={{ fontSize: '0.6rem' }}>▼</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_DATA.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#F5F5F5' } }}>
                <TableCell>{row.unitCode}</TableCell>
                <TableCell>{row.cnt}</TableCell>
                <TableCell>{row.activity}</TableCell>
                <TableCell align="right">{row.avgDays}</TableCell>
                <TableCell align="right">{row.dueDate}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
              <TableCell>Total</TableCell>
              <TableCell>59</TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell align="right">54</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
