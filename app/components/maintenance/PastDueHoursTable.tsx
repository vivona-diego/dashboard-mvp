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
  { unitCode: 'AT80-01', cnt: 1, activity: '300 Hr. Service - Lower', dueLower: 1364, currentLower: 1682, dueUpper: 0, currentUpper: 1936, hoursPastDue: 317.00 },
  { unitCode: 'RT50-01', cnt: 1, activity: '300 Hr. Service - Lower', dueLower: 10313, currentLower: 10409, dueUpper: 0, currentUpper: 0, hoursPastDue: 95.00 },
  { unitCode: 'T9', cnt: 1, activity: 'Maintenance Service', dueLower: 15697, currentLower: 15791, dueUpper: 0, currentUpper: 101822.00, hoursPastDue: 94.00 },
  { unitCode: 'AT15', cnt: 1, activity: '300 Hr. Service - Lower', dueLower: 2280, currentLower: 2331, dueUpper: 0, currentUpper: 6635, hoursPastDue: 51.00 },
];

export default function PastDueHoursTable() {
  const totals = MOCK_DATA.reduce(
    (acc, curr) => ({
      cnt: acc.cnt + curr.cnt,
      hoursPastDue: acc.hoursPastDue + curr.hoursPastDue,
    }),
    { cnt: 0, hoursPastDue: 0 }
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
          Past Due Unit Activities - By Hours
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflow: 'auto', maxHeight: 250 }}>
        <Table stickyHeader size="small" sx={{
           '& .MuiTableCell-root': { py: 0.6, px: 1, fontSize: '0.75rem', borderBottom: '1px solid #EEEEEE' },
           '& .MuiTableHead-root .MuiTableCell-root': { py: 0.6, verticalAlign: 'bottom' }
        }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Unit Code</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Cnt</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Activity</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Due Lower</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Current<br/>Lower</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Due Upper</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Current<br/>Upper</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, borderBottom: 'none' }}>
                 Hours Past<br/>Due
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
                <TableCell align="right">{row.dueLower}</TableCell>
                <TableCell align="right">{row.currentLower}</TableCell>
                <TableCell align="right">{row.dueUpper === 0 ? '' : row.dueUpper}</TableCell>
                <TableCell align="right">{row.currentUpper === 0 ? '0' : row.currentUpper}</TableCell>
                <TableCell align="right">{row.hoursPastDue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
              <TableCell>Total</TableCell>
              <TableCell>{totals.cnt}</TableCell>
              <TableCell colSpan={5}></TableCell>
              <TableCell align="right">{totals.hoursPastDue.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
